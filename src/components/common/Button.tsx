import React from 'react';
import { IButtonProps } from '../../types';

export const Button: React.FC<IButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  let variantClass = 'btn-primary';
  if (variant === 'host') variantClass = 'action-pill-btn btn-host';
  if (variant === 'attend') variantClass = 'action-pill-btn btn-attend';
  if (variant === 'chip') variantClass = 'category-chip';
  if (variant === 'social') variantClass = 'social-btn';
  if (variant === 'close') variantClass = 'modal-close-btn';

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
