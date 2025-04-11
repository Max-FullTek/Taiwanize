import {
  faCloudUploadAlt,
  faFileAlt,
  faFileAudio,
  faFileCode,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFileVideo,
  faFileWord,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import Button from '../Button/Button';
import { FileUploaderModel } from './FileUploader.model';
import './FileUploader.scss';

interface FileUploaderProps {
  onFileAccepted: (fileModel: FileUploaderModel) => void;
  acceptedFileTypes: string;
  onClearFile?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileAccepted,
  acceptedFileTypes,
  onClearFile
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileModel, setFileModel] = useState<FileUploaderModel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 拖放相關事件處理
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file, true);
    }
  };

  const handleFileSelection = (file: File, fromDrop = false) => {
    // 檢查檔案類型是否符合接受的類型
    const acceptedTypes = acceptedFileTypes.split(',');
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (acceptedTypes.some(type => type.includes(fileExtension))) {
      // 只有在拖放情況下才需要手動設置 input 的 files 屬性
      if (fromDrop && fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }

      // 創建 FileModel 並設置狀態
      setFileModel(new FileUploaderModel(file));
      // 將 FileModel 傳遞給父元件
      onFileAccepted(new FileUploaderModel(file));
    } else {
      alert(`不支援的檔案類型。請上傳以下格式: ${acceptedFileTypes}`);
    }
  };

  const handleFileAreaClick = () => {
    // 僅在沒有選擇檔案時點擊上傳區域才觸發文件選擇
    if (!fileModel) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // 根據檔案類型返回對應的圖示
  const getFileIcon = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (extension.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) {
      return faFileImage;
    } else if (extension.match(/\.(pdf)$/)) {
      return faFilePdf;
    } else if (extension.match(/\.(doc|docx)$/)) {
      return faFileWord;
    } else if (extension.match(/\.(xls|xlsx|csv)$/)) {
      return faFileExcel;
    } else if (extension.match(/\.(mp3|wav|ogg)$/)) {
      return faFileAudio;
    } else if (extension.match(/\.(mp4|avi|mov|wmv)$/)) {
      return faFileVideo;
    } else if (extension.match(/\.(js|jsx|ts|tsx|html|css|scss|json|xml|yaml|py|java|c|cpp)$/)) {
      return faFileCode;
    } else {
      return faFileAlt;
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免觸發整個區域的點擊事件
    setFileModel(null); // 清空檔案模型
    if (fileInputRef.current) fileInputRef.current.value = ''; // 清空 input 的檔案
    if (onClearFile) onClearFile();
  };

  return (
    <div
      className={`file-uploader ${isDragging ? 'dragging' : ''} ${fileModel ? 'has-file' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileAreaClick}
    >
      {fileModel && onClearFile && (
        <div className="delete-button-container">
          <Button
            className="delete-button"
            tooltip="重新上傳檔案"
            onClick={handleClearFile}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      )}

      {fileModel ? (
        <div className="file-info">
          <div className="file-content">
            <FontAwesomeIcon icon={getFileIcon(fileModel.fileName)} size="2x" className="file-icon" />
            <div className="file-name">{fileModel.fileName.split('\\').pop()}</div>
          </div>

          <div className="file-metadata">
            <div className="file-type">{fileModel.fileType}</div>
            <div className="file-size">{fileModel.getFormattedSize()}</div>
            <div className="file-date">{fileModel.getFormattedDate()}</div>
          </div>
        </div>
      ) : (
        <div className="drop-zone-text">
          <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
          <p>拖曳檔案至此處或點擊上傳檔案</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUploader;