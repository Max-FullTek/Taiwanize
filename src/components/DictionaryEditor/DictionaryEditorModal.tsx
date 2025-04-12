import { faDownload, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { DictionaryEditorModel } from './DictionaryEditor.model';
import './DictionaryEditor.scss';

interface DictionaryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DictionaryEditorModal: React.FC<DictionaryEditorModalProps> = ({ isOpen, onClose }) => {
  // 創建模型實例
  const [model] = useState(() => new DictionaryEditorModel());

  // 從模型中獲取狀態
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // 初始化時註冊狀態變更的監聽器
  useEffect(() => {
    model.registerListeners({
      onContentChange: setContent,
      onLoadingChange: setIsLoading,
      onErrorChange: setError,
      onSaveMessageChange: setSaveMessage
    });

    // 當模態框打開時載入詞庫數據
    if (isOpen) {
      model.loadDictionary();
    }
  }, [model, isOpen]);

  // 處理工具欄按鈕點擊事件
  const handleDownloadDictionary = () => {
    model.handleDownload();
  };

  const handleUploadDictionary = () => {
    model.handleUpload();
  };

  const handleSaveDictionary = () => {
    model.handleSave();
  };

  // 內容變更時更新模型
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    model.content = e.target.value;
  };

  // 重設錯誤狀態
  const handleResetError = () => {
    model.error = null;
  };

  // 詞庫編輯器內容渲染
  const renderEditorContent = () => {
    if (isLoading) {
      return <div className="dictionary-loading">載入詞庫中...</div>;
    }

    if (error) {
      return (
        <div className="dictionary-error">
          <p>{error}</p>
          <Button style="filled" onClick={handleResetError}>
            重試
          </Button>
        </div>
      );
    }

    return (
      <div className="dictionary-editor">
        <div className="dictionary-description">
          <p>在這裡您可以編輯自訂翻譯詞庫。格式為「簡體中文詞彙,臺灣用詞」，每行一組詞彙。</p>
          {saveMessage && <div className="save-message">{saveMessage}</div>}
        </div>

        <div className="textarea-container">
          <textarea
            className="dictionary-textarea"
            value={content}
            onChange={handleContentChange}
            placeholder="格式範例：
冷靜地,冷靜的
打印,列印
回車,換行"
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="自訂翻譯詞庫"
      actions={
        <>
          <Button
            style="icon"
            tooltip="下載詞庫"
            tooltipPosition="bottom"
            onClick={handleDownloadDictionary}
          >
            <FontAwesomeIcon icon={faDownload} />
          </Button>
          <Button
            style="icon"
            tooltip="上傳詞庫"
            tooltipPosition="bottom"
            onClick={handleUploadDictionary}
          >
            <FontAwesomeIcon icon={faUpload} />
          </Button>
          <Button
            style="icon"
            tooltip="儲存詞庫"
            tooltipPosition="bottom"
            onClick={handleSaveDictionary}
          >
            <FontAwesomeIcon icon={faSave} />
          </Button>
        </>
      }
    >
      {renderEditorContent()}
    </Modal>
  );
};

export default DictionaryEditorModal;