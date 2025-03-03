import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Upload, X, FileText, BarChart2, Award, Briefcase, Edit, UploadCloud, Eye } from 'lucide-react';

import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

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
        <img 
          src={logoSrc} 
          alt="CertifBAI" 
          className="h-8 App-logo cursor-pointer" 
          onClick={() => navigate('/')} 
        />
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
    <div className="relative flex flex-col items-center justify-center min-h-[calc(135vh-80px)] bg-white text-center p-6">
      <div className="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: 'url(HeroPageBG.png)' }}></div>
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


export function Footer() {
  return (
    <footer className="bg-[#002833] text-white mt-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">CertifBAI</h2>
            <p className="text-sm text-gray-300">
            "Accelerate Your Growth, One Insight at a Time"
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold"></h3>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-300">1234 Innovation Blvd, Tech City, TX 12345</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-300">(123) 456-7890</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-300">info@certifbai.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                About Us
              </a>
              <a href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">
                Services
              </a>
              <a href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <a href="/faq" className="text-sm text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8" />

        {/* Copyright */}
        <div className="text-center pt-6">
          <p className="text-sm text-gray-400">
            © 2025 CertifBAI. All rights reserved. 
            <a href="/privacy" className="ml-4 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="ml-4 hover:text-white transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Tutorial() {
  const steps = [
    {
      stepNumber: 1,
      title: 'Upload your Resume',
      details: 'Simply choose your Resume file from your device. CertifBAI only supports PDF Files.',
      icon: <img src="T1.png" alt="Step 1" className="w-24 h-24 mb-4" />
    },
    {
      stepNumber: 2,
      title: 'Wait for Bai to Analyze',
      details: 'Bai thoroughly analyzes your resume to give you accurate insights',
      icon: <img src="T2.png" alt="Step 2" className="w-24 h-24 mb-4" />
    },
    {
      stepNumber: 3,
      title: "See Bai's Insights",
      details: 'Get detailed feedback on your resume and suggestions for improvement.',
      icon: <img src="T3.png" alt="Step 3" className="w-24 h-24 mb-4" />
    },
  ];

  return (
    <section className="py-12 px-11 bg-white relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: 'url(Tutorial_bgImage.png)' }}
      ></div>
      <h2 className="text-3xl font-bold text-center mb-16 text-[#002833] relative z-10">
        How to Enhance Your Resume with CertifBAI ?
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-20 relative z-10">
        {steps.map((item) => (
          <div
            key={item.stepNumber}
            className="
              group 
              relative 
              w-64 
              h-60 
              border 
              border-gray-300 
              rounded-lg 
              overflow-hidden 
              p-4 
              text-center 
              transition-all 
              duration-300 
              hover:h-80 
              hover:shadow-lg
              cursor-pointer
              flex
              flex-col
              items-center
              justify-center
              bg-white
            "
          >
            <div className="flex items-center justify-center w-24 h-24 mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-[#002833]">
              Step {item.stepNumber}
            </h3>
            <p className="mt-2 text-[#002833]">{item.title}</p>

            {/* Hidden details that appear on hover */}
            <p
              className="
                hidden 
                group-hover:block 
                mt-4 
                text-sm 
                text-gray-600
              "
            >
              {item.details}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}