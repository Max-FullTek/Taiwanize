import React, { ReactNode, useState } from 'react';
import './Button.scss';

// 定義按鈕樣式類型
type ButtonStyle = 'outline' | 'icon' | 'filled';
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: ButtonStyle;
  className?: string;
  disabled?: boolean;
  isRound?: boolean;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  style = 'icon',
  className = '',
  disabled = false,
  isRound = false,
  tooltip,
  tooltipPosition = 'top',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="button-container">
      <button
        className={`button button-${style} ${className} ${isRound ? 'round' : ''}`}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => tooltip && setShowTooltip(true)}
        onMouseLeave={() => tooltip && setShowTooltip(false)}
      >
        <span className="button-content">{children}</span>
      </button>
      {tooltip && showTooltip && (
        <div className={`tooltip tooltip-${tooltipPosition}`}>
          {tooltip}
          <div className={`tooltip-arrow tooltip-arrow-${tooltipPosition}`}></div>
        </div>
      )}
    </div>
  );
};

export default Button;