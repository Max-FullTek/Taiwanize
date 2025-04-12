import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import Button from '../Button/Button';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // 新增 actions 屬性
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions }) => {
  // 按下 ESC 鍵關閉模態框
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // 禁止背景內容滾動
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // 恢復背景內容滾動
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <div className="modal-actions">
            {actions && (
              <>
                <div className="actions-container">{actions}</div>
                <div className="actions-divider"></div>
              </>
            )}
            <Button style="icon" isRound={true} onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;