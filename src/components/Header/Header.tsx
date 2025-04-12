import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Header.scss';
// 引入 Font Awesome 相關組件
import { faBook, faCog, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button/Button';
import DictionaryEditorModal from '../DictionaryEditor/DictionaryEditorModal';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showDictionaryEditor, setShowDictionaryEditor] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // 處理點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleOpenCustomDict = () => {
    // 關閉設定選單
    setShowSettings(false);
    // 打開詞庫編輯器
    setShowDictionaryEditor(true);
  };

  const handleCloseDictionaryEditor = () => {
    setShowDictionaryEditor(false);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Taiwanize</h1>

        <div className="header-tools">
          {/* 齒輪按鈕移到主題切換按鈕的左邊 */}
          <div className="settings-container" ref={settingsRef}>
            <Button
              tooltip="設定"
              tooltipPosition="bottom"
              onClick={handleSettingsClick}
            >
              <FontAwesomeIcon icon={faCog} />
            </Button>

            {showSettings && (
              <div className="settings-dropdown">
                <div className="settings-item" onClick={handleOpenCustomDict}>
                  <FontAwesomeIcon icon={faBook} />
                  <span>自訂翻譯詞庫</span>
                </div>
              </div>
            )}
          </div>

          <Button
            tooltip={theme === 'light' ? '深色模式' : '淺色模式'}
            tooltipPosition="bottom"
            onClick={toggleTheme}
          >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </Button>
        </div>
      </div>

      {/* 詞庫編輯器對話框 */}
      <DictionaryEditorModal
        isOpen={showDictionaryEditor}
        onClose={handleCloseDictionaryEditor}
      />
    </header>
  );
};

export default Header;