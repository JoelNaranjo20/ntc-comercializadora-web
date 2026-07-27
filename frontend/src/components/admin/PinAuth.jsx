import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { adminAuth } from '../../services/adminService';

export default function PinAuth({ onSuccess, onCancel }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const isValidPin = pin.every((d) => d !== '');

  useEffect(() => { inputRefs[0].current?.focus(); }, []);

  const handleInput = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newPin = [...pin]; newPin[index] = digit;
    setPin(newPin); setError('');
    if (digit && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) inputRefs[index - 1].current?.focus();
    if (e.key === 'Enter' && isValidPin) handleSubmit();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newPin = [...pin];
      pasted.split('').forEach((d, i) => { if (i < 4) newPin[i] = d; });
      setPin(newPin);
      inputRefs[Math.min(pasted.length, 3)].current?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!isValidPin || loading) return;
    setLoading(true); setError('');
    try {
      const result = await adminAuth(pin.join(''));
      if (result.success) { onSuccess(); }
      else { setError(result.message || 'PIN incorrecto.'); setPin(['', '', '', '']); inputRefs[0].current?.focus(); }
    } catch (err) { setError(err.message || 'Error al verificar el PIN.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">Panel de Administracion</h3>
        <p className="text-gray-400 text-sm">Ingrese el PIN de acceso para continuar</p>
      </div>
      <div className="flex items-center justify-center gap-3 mb-6">
        {pin.map((digit, i) => (
          <input key={i} ref={inputRefs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={(e) => handleInput(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={`w-14 h-16 text-2xl font-bold text-center rounded-xl border-2 bg-white transition-all duration-200 focus:outline-none focus:ring-4 ${error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-emerald-50 focus:border-emerald-400'}`}
            aria-label={`Digito ${i + 1} del PIN`} />
        ))}
      </div>
      {error && <p className="text-sm text-red-500 mb-4 font-medium">{error}</p>}
      <div className="flex items-center justify-center gap-3">
        <Button variant="secondary" onClick={handleSubmit} disabled={!isValidPin} loading={loading}>Acceder</Button>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}
