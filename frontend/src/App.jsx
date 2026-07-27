import React, { useState } from 'react';
import TopBar from './components/layout/TopBar';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import GallerySection from './components/sections/GallerySection';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/layout/Footer';
import AdminModal from './components/admin/AdminModal';
import WhatsAppButton from './components/ui/WhatsAppButton';
import ErrorBoundary from './components/ui/ErrorBoundary';
import useKeyboardShortcut from './hooks/useKeyboardShortcut';

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);

  useKeyboardShortcut('j', true, () => {
    setAdminOpen(true);
  });

  return (
    <ErrorBoundary>
      <div className="bg-white relative">
        <TopBar />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <ContactSection />
        <Footer />
        <WhatsAppButton />
        <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      </div>
    </ErrorBoundary>
  );
}
