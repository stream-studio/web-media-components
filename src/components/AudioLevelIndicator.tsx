import React from 'react';

export interface AudioLevelIndicatorProps {
  level: number;
  className?: string;
}

export function AudioLevelIndicator({ level, className = '' }: AudioLevelIndicatorProps) {
  const getColor = (level: number) => {
    if (level > 0.5) return '#ff4646';
    if (level > 0.2) return '#ffc800';
    return '#4caf50';
  };

  return (
    <div className={`w-32 h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-700 shadow-md ${className}`}>
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${Math.min(level * 100, 100)}%`,
          backgroundColor: getColor(level)
        }}
      />
    </div>
  );
} 