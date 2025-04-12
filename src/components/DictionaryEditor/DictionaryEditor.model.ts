import { dictionaryService } from '../../services/DictionaryService';

/**
 * DictionaryEditorModel - 詞庫編輯器模型
 * 封裝了詞庫編輯器的核心功能和狀態管理
 */
export class DictionaryEditorModel {
  private _content: string = '';
  private _isLoading: boolean = true;
  private _error: string | null = null;
  private _saveMessage: string | null = null;

  // 監聽器函數類型
  private _listeners: {
    onContentChange?: (content: string) => void;
    onLoadingChange?: (isLoading: boolean) => void;
    onErrorChange?: (error: string | null) => void;
    onSaveMessageChange?: (message: string | null) => void;
  } = {};

  constructor() {
    // 初始化時不需要載入詞庫，由調用者決定何時載入
  }

  // 註冊狀態變更監聽器
  public registerListeners(listeners: {
    onContentChange?: (content: string) => void;
    onLoadingChange?: (isLoading: boolean) => void;
    onErrorChange?: (error: string | null) => void;
    onSaveMessageChange?: (message: string | null) => void;
  }) {
    this._listeners = { ...this._listeners, ...listeners };
  }

  // 獲取詞庫內容
  public get content(): string {
    return this._content;
  }

  // 設置詞庫內容
  public set content(value: string) {
    this._content = value;
    if (this._listeners.onContentChange) {
      this._listeners.onContentChange(value);
    }
  }

  // 獲取載入狀態
  public get isLoading(): boolean {
    return this._isLoading;
  }

  // 設置載入狀態
  private set isLoading(value: boolean) {
    this._isLoading = value;
    if (this._listeners.onLoadingChange) {
      this._listeners.onLoadingChange(value);
    }
  }

  // 獲取錯誤訊息
  public get error(): string | null {
    return this._error;
  }

  // 設置錯誤訊息
  public set error(value: string | null) {
    this._error = value;
    if (this._listeners.onErrorChange) {
      this._listeners.onErrorChange(value);
    }
  }

  // 獲取儲存訊息
  public get saveMessage(): string | null {
    return this._saveMessage;
  }

  // 設置儲存訊息
  public set saveMessage(value: string | null) {
    this._saveMessage = value;
    if (this._listeners.onSaveMessageChange) {
      this._listeners.onSaveMessageChange(value);
    }
  }

  /**
   * 從 IndexedDB 或檔案載入詞庫
   */
  public async loadDictionary(): Promise<void> {
    try {
      this.isLoading = true;
      const dictContent = await dictionaryService.loadInitialDictionary();
      this.content = dictContent;
      this.isLoading = false;
    } catch (error) {
      console.error('讀取詞庫時出錯:', error);
      this.error = '無法讀取詞庫檔案，請稍後再試。';
      this.isLoading = false;
    }
  }

  /**
   * 下載詞庫
   */
  public async handleDownload(): Promise<void> {
    try {
      await dictionaryService.downloadDictionary();
    } catch (error) {
      console.error('下載詞庫時出錯:', error);
      this.error = '下載詞庫時出錯，請稍後再試。';
    }
  }

  /**
   * 上傳詞庫
   */
  public handleUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.csv,text/plain';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
              this.content = content;
              this.saveMessage = '已上傳詞庫，請點擊「儲存」以保存變更。';
              setTimeout(() => this.saveMessage = null, 3000);
            }
          };
          reader.readAsText(file);
        } catch (error) {
          console.error('讀取上傳檔案時出錯:', error);
          this.error = '讀取上傳檔案時出錯，請稍後再試。';
        }
      }
    };
    input.click();
  }

  /**
   * 儲存詞庫到 IndexedDB
   */
  public async handleSave(): Promise<void> {
    try {
      await dictionaryService.saveDictionary(this._content);
      this.saveMessage = '詞庫已成功儲存！';
      setTimeout(() => this.saveMessage = null, 3000);
    } catch (error) {
      console.error('儲存詞庫時出錯:', error);
      this.error = '儲存詞庫時出錯，請稍後再試。';
    }
  }
}