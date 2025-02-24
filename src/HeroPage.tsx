import React from 'react';
import { Menu, Upload, X } from 'lucide-react';

export function Navbar({ onMenuClick, setCurrentSection }: { onMenuClick: () => void; setCurrentSection: (section: string) => void }) {
  return (
    <nav className="flex justify-between items-center p-6 relative">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4">
          <Menu className="w-8 h-8 text-[#002833]" />
        </button>
        <img src="/Logo.png" alt="CertifBAI" className="h-8 App-logo" />
      </div>
      <div className="flex gap-4">
        <button onClick={() => setCurrentSection('about')} className="px-6 py-2 rounded-full bg-[#002833] text-white hover:bg-[#003845] transition-colors">
          About Us
        </button>
        <button onClick={() => setCurrentSection('job')} className="px-6 py-2 rounded-full bg-[#002833] text-white hover:bg-[#003845] transition-colors">
          Explore
        </button>
        <button onClick={() => setCurrentSection('contact')} className="px-6 py-2 rounded-full bg-[#002833] text-white hover:bg-[#003845] transition-colors">
          Contact
        </button>
      </div>
    </nav>
  );
}

export function MenuPanel({ isOpen, onClose, setCurrentSection }: { isOpen: boolean; onClose: () => void; setCurrentSection: (section: string) => void }) {
  return (
    <div 
      className={`fixed top-0 left-0 w-64 h-full bg-[#002833] transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <span className="text-white text-xl">Menu</span>
        <button onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6">
        <button onClick={() => { setCurrentSection('intro'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Home
        </button>
        <button onClick={() => { setCurrentSection('resume'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Resume Reader
        </button>
        <button onClick={() => { setCurrentSection('job'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Job Search
        </button>
        <button onClick={() => { setCurrentSection('about'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          About Us
        </button>
        <button onClick={() => { setCurrentSection('contact'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Contact
        </button>
      </div>
    </div>
  );
}

export function IntroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white text-center p-6">
      <h1 className="text-7xl font-bold mb-8 text-[#002833]">
        HELLO WORLD!<br />
        I AM BAI, YOUR AI COMPANION FOR YOUR JOB<br />
      </h1>
      <button className="px-8 py-3 rounded-full bg-[#002833] text-white text-lg hover:bg-[#003845] transition-colors">
        GET STARTED
      </button>
    </div>
  );
}