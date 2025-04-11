import React, { ReactNode, useState } from 'react';
import './Button.scss';

type ButtonType = 'primary' | 'success' | 'info' | 'danger';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  isRound?: boolean;
  tooltip?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'primary',
  className = '',
  disabled = false,
  isRound = false,
  tooltip
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="button-container">
      <button
        className={`button button-${type} ${className} ${isRound ? 'round' : ''}`}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => tooltip && setShowTooltip(true)}
        onMouseLeave={() => tooltip && setShowTooltip(false)}
      >
        <span className="button-content">{children}</span>
      </button>
      {tooltip && showTooltip && (
        <div className="tooltip">
          {tooltip}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default Button;