import React from 'react';

const variants = {
  primary:
    'bg-[#1E4FA3] text-white hover:bg-[#163E85] shadow-[0_2px_8px_rgba(30,79,163,0.2)] hover:shadow-[0_6px_20px_rgba(30,79,163,0.3)]',
  secondary:
    'bg-[#2FAF9B] text-white hover:bg-[#238F7E] shadow-[0_2px_8px_rgba(47,175,155,0.2)] hover:shadow-[0_6px_20px_rgba(47,175,155,0.3)]',
  outline:
    'border border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-slate-400',
  ghost:
    'text-slate-700 hover:bg-slate-100',
  white:
    'bg-white text-[#1E4FA3] hover:bg-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export default function Button({
  children, variant = 'primary', size = 'md', className = '',
  disabled = false, loading = false, type = 'button', ...props
}) {
  return (
    <button type={type} disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-roboto font-bold tracking-wide
        transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
        active:scale-[0.97] active:duration-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E4FA3]/50
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}`}
      {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
