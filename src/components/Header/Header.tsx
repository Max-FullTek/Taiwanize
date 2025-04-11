import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Header.scss';
// 引入 Font Awesome 相關組件
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Taiwanize</h1>

        <div className="header-tools">
          <button
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              // 月亮圖標 (深色模式)
              <FontAwesomeIcon icon={faMoon} />
            ) : (
              // 太陽圖標 (淺色模式)
              <FontAwesomeIcon icon={faSun} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;