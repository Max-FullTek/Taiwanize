/**
 * 詞庫管理服務，使用 IndexedDB 作為儲存媒介
 */
export class DictionaryService {
  private readonly DB_NAME = 'taiwanize-db';
  private readonly STORE_NAME = 'dictionary';
  private readonly DICT_KEY = 'custom-dict';
  private db: IDBDatabase | null = null;

  /**
   * 初始化資料庫
   */
  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // 如果資料表不存在，則創建
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        console.error('初始化 IndexedDB 失敗:', event);
        reject(new Error('初始化資料庫失敗'));
      };
    });
  }

  /**
   * 從專案的 taiwanize-custom-dict 檔案中讀取初始詞庫
   */
  public async loadInitialDictionary(): Promise<string> {
    try {
      // 先嘗試從 IndexedDB 讀取
      const savedDict = await this.getDictionary();
      if (savedDict) {
        return savedDict;
      }

      // 如果 IndexedDB 中沒有，則從專案檔案中讀取
      const response = await fetch('/taiwanize-custom-dict');
      if (!response.ok) {
        throw new Error('無法獲取詞庫檔案');
      }

      const content = await response.text();

      // 存入 IndexedDB
      await this.saveDictionary(content);

      return content;
    } catch (error) {
      console.error('讀取初始詞庫失敗:', error);
      return ''; // 返回空字串作為預設值
    }
  }

  /**
   * 從 IndexedDB 中獲取詞庫
   */
  public async getDictionary(): Promise<string> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('資料庫未初始化'));
        return;
      }

      const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(this.DICT_KEY);

      request.onsuccess = () => {
        resolve(request.result || '');
      };

      request.onerror = () => {
        console.error('從 IndexedDB 讀取詞庫失敗:', request.error);
        reject(new Error('讀取詞庫失敗'));
      };
    });
  }

  /**
   * 將詞庫保存到 IndexedDB
   */
  public async saveDictionary(content: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('資料庫未初始化'));
        return;
      }

      const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(content, this.DICT_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('儲存詞庫到 IndexedDB 失敗:', request.error);
        reject(new Error('儲存詞庫失敗'));
      };
    });
  }

  /**
   * 將詞庫內容導出為檔案下載
   */
  public async downloadDictionary(): Promise<void> {
    const content = await this.getDictionary();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'taiwanize-custom-dict';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }
}

// 創建單例實例
export const dictionaryService = new DictionaryService();