import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../ui/Modal';
import PinAuth from './PinAuth';
import ProductInfo from './ProductInfo';
import ImageManager from './ImageManager';
import { checkSession, logout } from '../../services/adminService';

const TABS = [
  { id: 'media', label: 'Medios', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'products', label: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
];

export default function AdminModal({ isOpen, onClose }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('media');
  const [sessionTimer, setSessionTimer] = useState(null);

  useEffect(() => {
    if (isOpen) {
      checkSession().then((data) => {
        if (data?.valid) { setAuthenticated(true); setSessionTimer(data.expiresIn); }
      }).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      setAuthenticated(false);
      setSessionTimer(null);
    };

    window.addEventListener('admin_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('admin_unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    if (!authenticated || sessionTimer == null) return;
    const interval = setInterval(() => {
      setSessionTimer((prev) => {
        if (prev <= 1) { handleLogout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [authenticated, sessionTimer]);

  const refreshActivity = useCallback(async () => {
    try { const data = await checkSession(); if (data?.valid) setSessionTimer(data.expiresIn); } catch {}
  }, []);

  const handleLoginSuccess = () => { setAuthenticated(true); setSessionTimer(30 * 60); };
  const handleLogout = () => { logout(); setAuthenticated(false); setSessionTimer(null); };

  const formatTime = (seconds) => {
    if (seconds == null) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={authenticated ? 'Panel de Administración' : undefined}>
      {!authenticated ? (
        <PinAuth onSuccess={handleLoginSuccess} onCancel={onClose} />
      ) : (
        <div onClick={refreshActivity} onKeyDown={refreshActivity}>
          {/* Session Bar */}
          <div className="flex items-center justify-between mb-5 px-4 py-2.5 bg-gradient-to-r from-[#1E4FA3]/5 to-[#2FAF9B]/5 rounded-xl border border-[#1E4FA3]/10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2FAF9B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2FAF9B]" />
              </span>
              <span className="text-sm text-gray-600 font-roboto">Sesión activa</span>
              <span className="text-xs text-gray-400 font-roboto px-2 py-0.5 bg-white rounded-full border border-gray-100">
                {formatTime(sessionTimer)}
              </span>
            </div>
            <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 font-roboto transition-colors">
              Cerrar sesión
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 p-1 bg-gray-50 rounded-xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-roboto transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#1E4FA3] shadow-sm border border-gray-100'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'media' && <ImageManager />}
            {activeTab === 'products' && <ProductInfo />}
          </div>
        </div>
      )}
    </Modal>
  );
}
