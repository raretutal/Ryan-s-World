import React, { useEffect, useRef } from 'react';
import { Menu, Upload, X, FileText, BarChart2, Award, Briefcase } from 'lucide-react';

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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      ref={panelRef}
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
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white text-center p-6">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(HeroPageBG.png)' }}></div>
      <h1 className="text-7xl font-bold mb-8 text-[#002833] relative z-10">
        HELLO!<br />
        I AM BAI, YOUR AI POWERED CAREER COMPANION<br />
      </h1>
      <button className="px-8 py-3 rounded-full bg-[#002833] text-white text-lg hover:bg-[#003845] transition-colors relative z-10">
        GET STARTED
      </button>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12">How CertifBAI Helps You Succeed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 bg-gray-100 rounded-lg shadow-lg flex items-center hover:bg-gray-200 transition-colors">
            <FileText className="w-24 h-20 text-[#002833] mr-6" />
            <div>
              <h3 className="text-2xl font-bold text-[#002833]">Resume Analysis</h3>
              <p className="text-[#002833]">Get detailed feedback on your resume and suggestions for improvement.</p>
            </div>
          </div>
          <div className="p-8 bg-gray-100 rounded-lg shadow-lg flex items-center hover:bg-gray-200 transition-colors">
            <BarChart2 className="w-24 h-20 text-[#002833] mr-6" />
            <div>
              <h3 className="text-2xl font-bold text-[#002833]">Skill Gap Analysis</h3>
              <p className="text-[#002833]">Compare your skills against job requirements and identify areas for growth.</p>
            </div>
          </div>
          <div className="p-8 bg-gray-100 rounded-lg shadow-lg flex items-center hover:bg-gray-200 transition-colors">
            <Award className="w-24 h-20 text-[#002833] mr-6" />
            <div>
              <h3 className="text-2xl font-bold text-[#002833]">Certification Finder</h3>
              <p className="text-[#002833]">Discover relevant certifications to enhance your qualifications.</p>
            </div>
          </div>
          <div className="p-8 bg-gray-100 rounded-lg shadow-lg flex items-center hover:bg-gray-200 transition-colors">
            <Briefcase className="w-24 h-20 text-[#002833] mr-6" />
            <div>
              <h3 className="text-2xl font-bold text-[#002833]">Job Matching</h3>
              <p className="text-[#002833]">Find opportunities that match your skills and career goals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}