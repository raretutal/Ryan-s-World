import React, { useState } from 'react';
import { Menu, Upload, X } from 'lucide-react';

function Navbar({ onMenuClick, setCurrentSection }: { onMenuClick: () => void; setCurrentSection: (section: string) => void }) {
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

function MenuPanel({ isOpen, onClose, setCurrentSection }: { isOpen: boolean; onClose: () => void; setCurrentSection: (section: string) => void }) {
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

function IntroSection() {
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

function JobSearch() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="flex items-center gap-8 mb-8">
        <img src="/AssistantIcon.png" alt="AI Assistant" className="AssistantDimension"/>
        <h2 className="text-2xl font-medium text-[#002833]">
          What job do you want to apply?
        </h2>
      </div>
      <button className="w-full max-w-md px-8 py-3 rounded-full bg-[#002833] text-white text-lg hover:bg-[#003845] transition-colors">
        ENTER
      </button>
    </div>
  );
}

function ResumeReader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h2 className="text-4xl font-bold mb-8 text-[#002833]">Resume Reader</h2>
      <div className="w-full max-w-2xl bg-gray-200 rounded-3xl p-12">
        <p className="text-center mb-8 text-lg">
          Upload resume to get feedback and suggestion with BAI
        </p>
        <div className="border-4 border-[#002833] border-dashed rounded-3xl p-12 flex flex-col items-center">
          <Upload className="w-16 h-16 text-[#002833] mb-4" />
          <p className="text-center text-gray-600">
            compatible files blah blah
          </p>
        </div>
        <button className="w-full mt-8 px-8 py-3 rounded-full bg-[#002833] text-white text-lg hover:bg-[#003845] transition-colors">
          ANALYZE RESUME
        </button>
      </div>
    </div>
  );
}

function AboutUs() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex flex-col items-center">
        <img src="/Logo2.png" alt="About Us" className="about-us-image mb-4" />
        <hr className="w-full max-w-md border-t-2 border-[#002833] mb-8" />
        <h2 className="text-4xl font-bold mb-8 text-[#002833]">About Us</h2>
        <p className="text-center mb-8 text-lg">
          We, CertifBAI, are a team of 5 students who are passionate about AI and its applications. <br/>
          We are currently working on a project that aims to help job seekers to improve their resume <br/>
          and increase their chances of getting hired.
        </p>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h2 className="text-4xl font-bold mb-8 text-[#002833]">Contact</h2>
      <p className="text-center mb-8 text-lg">
        Contact information.
      </p>
    </div>
  );
}

function App() {
  const [currentSection, setCurrentSection] = useState('intro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} setCurrentSection={setCurrentSection} />
      <Navbar onMenuClick={() => setIsMenuOpen(true)} setCurrentSection={setCurrentSection} />
      {currentSection === 'intro' && <IntroSection />}
      {currentSection === 'job' && <JobSearch />}
      {currentSection === 'resume' && <ResumeReader />}
      {currentSection === 'about' && <AboutUs />}
      {currentSection === 'contact' && <Contact />}
    </div>
  );
}

export default App;