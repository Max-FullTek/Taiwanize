import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as OpenCC from 'opencc-js';
import { useState } from 'react';
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


  // 創建簡體到繁體(台灣)的轉換器
  const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

  // 簡化預覽文字生成函數，直接取前 MAX_PREVIEW_CHARS 字元
  const generatePreview = (text: string): string => {
    if (!text) return '';
    return text.substring(0, MAX_PREVIEW_CHARS);
  };

  // 處理檔案讀取與轉換的通用函數
  const processFile = (newFileModel: FileUploaderModel) => {
    if (!newFileModel) return;

    console.log('File accepted:', newFileModel.fileName);
    setFileModel(newFileModel);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const previewText = text.substring(0, MAX_PREVIEW_CHARS);
      setPreviewContent(generatePreview(previewText));

      // 自動轉換預覽內容
      if (previewText) {
        const converted = converter(previewText);
        setPreviewConverted(generatePreview(converted));
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

  const downloadFile = () => {
    if (!fileModel) {
      alert('請先上傳文件進行轉換！');
      return;
    }

    // 下載時才讀取並轉換整個檔案
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const converted = converter(text);

        const element = document.createElement('a');
        const downloadFile = new Blob([converted], { type: 'text/plain' });
        element.href = URL.createObjectURL(downloadFile);
        element.download = `converted_${fileModel.fileName}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    };
    reader.readAsText(fileModel.file);
  };

  return (
    <div className="container">
      <div className="app-description">
        <p>此應用程式可以將簡體中文文字轉換為繁體中文（臺灣標準）。使用方式：</p>
        <ol>
          <li>點擊「選擇檔案」按鈕或直接拖曳檔案至畫面上傳</li>
          <li>支援格式: .txt、.json、.md、.csv、.html</li>
          <li>檔案上傳後會自動轉換為繁體中文</li>
          <li>在預覽區塊可以查看轉換前後的內容</li>
          <li>點擊「下載」按鈕可以將轉換後的內容下載為文件</li>
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

        {previewConverted && (
          <Card className="preview-section">
            <div className="card-header">
              <h3>轉換後內容預覽</h3>
              <div className="card-action">
                <Button
                  className="download-btn"
                  onClick={downloadFile}
                  tooltip='下載轉換後的檔案'
                >
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
              </div>
            </div>
            <div className="preview-content">
              {previewConverted}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Home;