import React from 'react';
import { Tooltip } from '@mui/material';
import { VerifiedBadgeProps } from '../../types';

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 18,
  title = 'Verified Identity',
  className = '',
}) => {
  return (
    <Tooltip title={title} arrow placement="top">
      <span className={`inline-flex items-center justify-center align-middle ml-1.5 leading-none ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            fill="#0095F6"
          />
          <path
            d="M9.9997 15.1703L7.5297 12.7003C7.1397 12.3103 6.5097 12.3103 6.1197 12.7003C5.7297 13.0903 5.7297 13.7203 6.1197 14.1103L9.2897 17.2803C9.6797 17.6703 10.3097 17.6703 10.6997 17.2803L17.8797 10.1003C18.2697 9.7103 18.2697 9.0803 17.8797 8.6903C17.4897 8.3003 16.8597 8.3003 16.4697 8.6903L9.9997 15.1703Z"
            fill="#FFFFFF"
          />
        </svg>
      </span>
    </Tooltip>
  );
};
