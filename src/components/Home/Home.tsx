import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { translationService } from '../../services/TranslationService';
import Button from '../Button/Button';
import Card from '../Card/Card';
import FileUploader from '../FileUploader/FileUploader';
import { FileUploaderModel } from '../FileUploader/FileUploader.model';
import './Home.scss';

// 常數參數設定
const MAX_PREVIEW_CHARS = 3000; // 預覽最多顯示的字元數
const ACCEPTED_FILE_TYPES = ".txt,.json,.md,.csv,.html"; // 接受的檔案類型

function Home() {
  const [fileModel, setFileModel] = useState<FileUploaderModel | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewConverted, setPreviewConverted] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // 簡化預覽文字生成函數，直接取前 MAX_PREVIEW_CHARS 字元
  const generatePreview = (text: string): string => {
    if (!text) return '';
    return text.substring(0, MAX_PREVIEW_CHARS);
  };

  // 處理檔案讀取與轉換的通用函數
  const processFile = async (newFileModel: FileUploaderModel) => {
    if (!newFileModel) return;

    setFileModel(newFileModel);
    setIsConverting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const previewText = text.substring(0, MAX_PREVIEW_CHARS);
      setPreviewContent(generatePreview(previewText));

      // 使用 TranslationService 進行轉換
      if (previewText) {
        try {
          const converted = await translationService.convertText(previewText);
          setPreviewConverted(generatePreview(converted));
        } catch (error) {
          console.error('轉換文字時發生錯誤:', error);
          alert('轉換文字時發生錯誤，請稍後再試');
        } finally {
          setIsConverting(false);
        }
      }
    };
    reader.readAsText(newFileModel.file);
  };

  // 清空功能
  const clearContent = () => {
    setFileModel(null);
    setPreviewContent('');
    setPreviewConverted('');
  };

  const downloadFile = async () => {
    if (!fileModel) {
      alert('請先上傳文件進行轉換！');
      return;
    }

    setIsConverting(true);

    // 下載時才讀取並轉換整個檔案
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (text) {
        try {
          const converted = await translationService.convertText(text);

          const element = document.createElement('a');
          const downloadFile = new Blob([converted], { type: 'text/plain' });
          element.href = URL.createObjectURL(downloadFile);
          element.download = `converted_${fileModel.fileName}`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        } catch (error) {
          console.error('轉換文字時發生錯誤:', error);
          alert('轉換文字時發生錯誤，請稍後再試');
        } finally {
          setIsConverting(false);
        }
      }
    };
    reader.readAsText(fileModel.file);
  };

  return (
    <div className="container">
      <div className="app-description">
        <p>此應用程式可將簡體中文轉換為臺灣標準繁體中文，並支援自訂辭庫優化。使用方式：</p>
        <ol>
          <li>點擊「選擇檔案」按鈕或直接拖曳檔案至畫面進行上傳</li>
          <li>支援格式: .txt、.json、.md、.csv、.html 等文字檔案</li>
          <li>檔案上傳後會自動套用自訂辭庫進行轉換，包含臺灣地區專有名詞與慣用語</li>
          <li>可在預覽區塊查看轉換前後的內容比對，並可點擊「下載」按鈕儲存轉換結果</li>
        </ol>
      </div>

      <FileUploader
        onFileAccepted={processFile}
        acceptedFileTypes={ACCEPTED_FILE_TYPES}
        onClearFile={clearContent}
      />

      <div className="text-preview">
        {previewContent && (
          <Card className="preview-section">
            <div className="card-header">
              <h3>原始內容預覽</h3>
              <div className="card-action"></div>
            </div>
            <div className="preview-content">
              {previewContent}
            </div>
          </Card>
        )}

        {(previewConverted || isConverting) && (
          <Card className="preview-section">
            <div className="card-header">
              <h3>轉換後內容預覽 {isConverting && '(轉換中...)'}</h3>
              <div className="card-action">
                <Button
                  className="download-btn"
                  onClick={downloadFile}
                  disabled={isConverting}
                  tooltip='下載轉換後的檔案'
                >
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
              </div>
            </div>
            <div className="preview-content">
              {isConverting ? '正在處理中...' : previewConverted}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Home;