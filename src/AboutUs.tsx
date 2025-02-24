import React from 'react';

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

export default AboutUs;