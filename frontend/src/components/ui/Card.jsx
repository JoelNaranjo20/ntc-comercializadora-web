import React from 'react';

export default function Card({ children, className = '', hover = false, padding = 'p-6', ...props }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_6px_20px_rgba(0,0,0,0.03)]
      ${padding}
      ${hover ? 'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.05)] hover:border-gray-200' : ''}
      ${className}`}
      {...props}>
      {children}
    </div>
  );
}
