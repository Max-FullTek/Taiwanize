import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Header.scss';
// 引入 Font Awesome 相關組件
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../Button/Button';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Taiwanize</h1>

        <div className="header-tools">
          <Button
            tooltip={theme === 'light' ? '深色模式' : '淺色模式'}
            tooltipPosition="bottom"
            onClick={toggleTheme}
          >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;