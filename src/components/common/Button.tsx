import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'host' | 'attend' | 'chip' | 'social' | 'close';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
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
