import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Upload, X, FileText, BarChart2, Award, Briefcase } from 'lucide-react';

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = useState('/Logo.png');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 678) {
        setLogoSrc('Logo2.png');
      } else {
        setLogoSrc('/Logo.png');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center p-6 relative z-20">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4">
          <Menu className="w-8 h-8 text-[#002833]" />
        </button>
        <img src={logoSrc} alt="CertifBAI" className="h-8 App-logo" />
      </div>
      <div className="flex gap-4">
        <button onClick={() => navigate('/about')} className="px-6 py-2 rounded-full bg-[#002833] text-white hover:bg-[#003845] transition-colors">
          About Us
        </button>
        <button onClick={() => navigate('/job')} className="px-6 py-2 rounded-full bg-[#002833] text-white hover:bg-[#003845] transition-colors">
          Explore
        </button>
        <button onClick={() => navigate('/contact')} className="px-6 py-2 rounded-full bg-[#002833] text-white hover:bg-[#003845] transition-colors">
          Contact
        </button>
      </div>
    </nav>
  );
}

export function MenuPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
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
        <button onClick={() => { navigate('/'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Home
        </button>
        <button onClick={() => { navigate('/resume-reader'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Resume Reader
        </button>
        <button onClick={() => { navigate('/job'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Job Search
        </button>
        <button onClick={() => { navigate('/about'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          About Us
        </button>
        <button onClick={() => { navigate('/contact'); onClose(); }} className="w-full text-left text-white py-3 hover:text-gray-300 transition-colors">
          Contact
        </button>
      </div>
    </div>
  );
}

export function IntroSection() {
  const handleGetStartedClick = () => {
    const jobCardElement = document.getElementById('jobCard');
    if (jobCardElement) {
      jobCardElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(120vh-80px)] bg-white text-center p-6">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(HeroPageBG.png)' }}></div>
      <h1 className="text-7xl font-bold mb-16 text-[#002833] relative z-10">
        HELLO!<br />
        I AM BAI, YOUR AI POWERED CAREER COMPANION<br />
      </h1>
      <button onClick={handleGetStartedClick} className="px-10 py-5 rounded-full font-bold bg-[#002833] text-white text-lg hover:bg-[#003845] transition-colors relative z-10">
        GET STARTED
      </button>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-16">How CertifBAI Helps You Succeed</h2>
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

{/* Centered Job Application Card */}
export function CenteredJobApplicationCard() {
  return (
    <div id="jobCard" className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* Card Container */}
      <div className="p-8 bg-gray-100 rounded-lg shadow-lg hover:bg-gray-200 transition-colors w-full max-w-2xl flex items-start">
        {/* Icon */}
        <img src="/AssistantIcon_Search.png" alt="Assistant Icon" className="w-40 h-40 mr-4" />
        <div className="flex flex-col w-full">
          {/* Title */}
          <h3 className="text-2xl font-bold text-[#002833] mb-4">
            What job do you want to apply?
          </h3>
          {/* Text Input */}
          <input
            type="text"
            placeholder="Enter job title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#002833] mb-4"
          />
          {/* ENTER Button */}
          <div className="flex justify-center">
            <button className="bg-[#002833] text-white px-6 py-2 rounded-lg 
                               hover:bg-opacity-90 transition-colors">
              ENTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#002833] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4">
            <a href="/about" className="hover:underline">About Us</a>
            <a href="/contact" className="hover:underline">Contact</a>
          </div>
        </div>
        <div className="text-center mt-4">
          <p style={{ color: 'white', fontSize: '12px' }}>&copy; 2025 CertifBAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}