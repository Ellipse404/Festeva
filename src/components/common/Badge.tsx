import React from 'react';
import { MapPin } from 'lucide-react';
import { IBadgeProps } from '../../types';
import { formatCategoryLabel } from '../../utils/formatters';
import { formatDistance } from '../../utils/distance';

export const Badge: React.FC<IBadgeProps> = ({ type, value, paid }) => {
  if (type === 'distance') {
    return (
      <div className="distance-badge" title="Distance from your location">
        <MapPin size={13} />
        <span>{formatDistance(Number(value))}</span>
      </div>
    );
  }

  if (type === 'category') {
    return (
      <div className="category-tag">
        {formatCategoryLabel(String(value))}
      </div>
    );
  }

  return (
    <span className={`price-value ${paid ? 'paid' : ''}`}>
      {value === 0 ? 'FREE' : `$${value}`}
    </span>
  );
};
