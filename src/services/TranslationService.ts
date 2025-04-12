import * as OpenCC from 'opencc-js';
import { dictionaryService } from './DictionaryService';

/**
 * 文字轉譯服務，處理簡體轉繁體及自訂詞庫替換
 */
export class TranslationService {
  // 創建簡體到繁體(台灣)的轉換器
  private converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
  // 詞庫緩存
  private customDictCache: Record<string, string> | null = null;

  constructor() {
    // 在建構函式中初始化詞庫
    this.initDictionary();
  }

  /**
   * 初始化詞庫，在服務創建時載入詞庫到記憶體中
   */
  private async initDictionary(): Promise<void> {
    try {
      await dictionaryService.init();
      // 預先載入詞庫到緩存
      this.customDictCache = await this.getCustomDictionary();
      console.log('詞庫已成功初始化，載入了 ' + Object.keys(this.customDictCache).length + ' 個詞條');
    } catch (error) {
      console.error('詞庫初始化失敗:', error);
    }
  }

  /**
   * 使用 OpenCC 進行簡體到繁體(台灣)轉換，然後再使用自訂詞庫進行進一步優化
   */
  public async convertText(text: string): Promise<string> {
    if (!text) return '';

    // 先使用 OpenCC 轉換
    let convertedText = this.converter(text);

    // 如果詞庫緩存不存在，則嘗試載入
    if (!this.customDictCache) {
      this.customDictCache = await this.getCustomDictionary();
    }

    // 再使用自訂詞庫進行轉換
    if (this.customDictCache && Object.keys(this.customDictCache).length > 0) {
      convertedText = this.applyCustomDictionary(convertedText, this.customDictCache);
      console.log('已套用自訂詞庫轉換，詞庫大小:', Object.keys(this.customDictCache).length);
    } else {
      console.log('未套用自訂詞庫，詞庫為空或尚未載入完成');
    }

    return convertedText;
  }

  /**
   * 解析自訂詞庫字串為詞庫物件
   */
  private async getCustomDictionary(): Promise<Record<string, string>> {
    try {
      const dictContent = await dictionaryService.getDictionary();
      if (!dictContent) {
        console.log('詞庫內容為空');
        return {};
      }

      const dict: Record<string, string> = {};
      const lines = dictContent.split('\n');

      for (const line of lines) {
        if (line.trim() && !line.startsWith('#')) {
          // 支援多種分隔符號: =>, ->, 逗號
          let parts: string[] = [];

          if (line.includes('=>')) {
            parts = line.split('=>').map(part => part.trim());
          } else if (line.includes('->')) {
            parts = line.split('->').map(part => part.trim());
          } else if (line.includes(',')) {
            parts = line.split(',').map(part => part.trim());
          }

          if (parts.length === 2 && parts[0] && parts[1]) {
            dict[parts[0]] = parts[1];
          } else {
            console.warn('無效的詞條格式:', line);
          }
        }
      }

      console.log(`從詞庫內容中解析出 ${Object.keys(dict).length} 個詞條`);

      // 如果有詞條，輸出前幾個作為示例
      if (Object.keys(dict).length > 0) {
        const examples = Object.entries(dict).slice(0, 3);
        examples.forEach(([key, value]) => {
          console.log(`詞條示例: "${key}" -> "${value}"`);
        });
      }

      return dict;
    } catch (error) {
      console.error('讀取自訂詞庫失敗:', error);
      return {};
    }
  }

  /**
   * 使用自訂詞庫進行文字替換
   */
  private applyCustomDictionary(text: string, dict: Record<string, string>): string {
    let result = text;

    // 按照詞彙長度從長到短排序，確保較長的詞彙先被替換
    const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      if (!key || !dict[key]) continue;

      try {
        // 使用正規表達式以確保完整詞彙匹配
        const regex = new RegExp(this.escapeRegExp(key), 'g');
        const before = result;
        result = result.replace(regex, dict[key]);

        // 偵錯：檢查是否有發生替換
        if (before !== result) {
          console.log(`詞彙替換: "${key}" -> "${dict[key]}"`);
        }
      } catch (error) {
        console.error(`替換詞彙 "${key}" 時發生錯誤:`, error);
      }
    }

    return result;
  }

  /**
   * 轉義正規表達式中的特殊字元
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 手動重新載入詞庫，當詞庫內容被更新後可調用此方法
   */
  public async reloadDictionary(): Promise<void> {
    this.customDictCache = null;  // 清空緩存
    this.customDictCache = await this.getCustomDictionary();
    console.log('詞庫已重新載入，包含 ' + Object.keys(this.customDictCache).length + ' 個詞條');
  }
}

// 創建單例實例
export const translationService = new TranslationService();