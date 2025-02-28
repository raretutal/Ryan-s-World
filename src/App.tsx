import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar, MenuPanel, IntroSection, CenteredJobApplicationCard, Footer, Tutorial } from './HeroPage';
import ResumeReader from './ResumeReader';
import AboutUs from './AboutUs';
import Contact from './Contact';
import JobSearch from './JobSearch';

function App() {
  const [currentSection, setCurrentSection] = useState('intro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        <Routes>
          <Route path="/" element={
            <>
              <IntroSection />
              <Tutorial />
              <CenteredJobApplicationCard />
              <Footer />
            </>
          } />
          <Route path="/resume-reader" element={<ResumeReader />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/job" element={<JobSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;