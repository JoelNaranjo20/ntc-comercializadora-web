import React from 'react';

export default function Input({
  label, name, type = 'text', value, onChange,
  error, placeholder = '', required = false, className = '', rows, ...props
}) {
  const isTextarea = type === 'textarea';
  const baseClasses = `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400
    transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
    focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400
    ${error
      ? 'border-red-200 ring-1 ring-red-50'
      : 'border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-gray-300'}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-medium tracking-wider text-gray-400 uppercase">
          {label}{required && <span className="text-emerald-500 ml-0.5">*</span>}
        </label>
      )}
      {isTextarea ? (
        <textarea id={name} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required={required} rows={rows || 4} className={baseClasses} {...props} />
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required} className={baseClasses} {...props} />
      )}
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}
