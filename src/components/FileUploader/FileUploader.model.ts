/**
 * FileUploaderModel - 檔案資訊模型
 * 將檔案相關資訊封裝成一個模型類別，方便在元件間傳遞
 */
export class FileUploaderModel {
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified: Date;

  constructor(file: File) {
    this.file = file;
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileType = this.getFileType(file.name);
    this.lastModified = new Date(file.lastModified);
  }

  /**
   * 獲取格式化後的檔案大小
   */
  getFormattedSize(): string {
    if (this.fileSize === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(this.fileSize) / Math.log(k));

    return parseFloat((this.fileSize / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 獲取檔案類型描述
   */
  getFileType(filename: string): string {
    const extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return '圖片檔案';
    } else if (extension === 'pdf') {
      return 'PDF檔案';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'Word檔案';
    } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return 'Excel檔案';
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return '音訊檔案';
    } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
      return '影片檔案';
    } else if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'py', 'java', 'c', 'cpp'].includes(extension)) {
      return '程式碼檔案';
    } else if (['txt', 'md'].includes(extension)) {
      return '文字檔案';
    } else {
      return `${extension.toUpperCase()} 檔案`;
    }
  }

  /**
   * 獲取格式化後的日期
   */
  getFormattedDate(): string {
    return this.lastModified.toLocaleString('zh-TW');
  }

  /**
   * 根據檔案類型返回對應的圖示名稱
   */
  getIconType(): string {
    const extension = this.fileName.substring(this.fileName.lastIndexOf('.')).toLowerCase();

    if (extension.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) {
      return 'image';
    } else if (extension.match(/\.(pdf)$/)) {
      return 'pdf';
    } else if (extension.match(/\.(doc|docx)$/)) {
      return 'word';
    } else if (extension.match(/\.(xls|xlsx|csv)$/)) {
      return 'excel';
    } else if (extension.match(/\.(mp3|wav|ogg)$/)) {
      return 'audio';
    } else if (extension.match(/\.(mp4|avi|mov|wmv)$/)) {
      return 'video';
    } else if (extension.match(/\.(js|jsx|ts|tsx|html|css|scss|json|xml|yaml|py|java|c|cpp)$/)) {
      return 'code';
    } else {
      return 'default';
    }
  }
}