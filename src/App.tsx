import React, { useState } from 'react';
import { Navbar, MenuPanel, IntroSection } from './HeroPage';
import CenteredJobApplicationCard from './HeroPage';
import ResumeReader from './ResumeReader';
import AboutUs from './AboutUs';
import Contact from './Contact';
import JobSearch from './JobSearch';

function App() {
  const [currentSection, setCurrentSection] = useState('intro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} setCurrentSection={setCurrentSection} />
      <Navbar onMenuClick={() => setIsMenuOpen(true)} setCurrentSection={setCurrentSection} />
      {currentSection === 'intro' && <IntroSection />}
      {currentSection === 'intro' && <CenteredJobApplicationCard />}
      {currentSection === 'job' && <JobSearch />}
      {currentSection === 'resume' && <ResumeReader />}
      {currentSection === 'about' && <AboutUs />}
      {currentSection === 'contact' && <Contact />}
    </div>
  );
}

export default App;