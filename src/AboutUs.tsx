import React from "react";

function AboutUs() {
  return (
    <div>
      <div
        className="min-h-screen bg-[#002833] relative"
        style={{ top: "40px" }}
      >
        <div className="w-full bg-white relative z-20" style={{ top: "-10px" }}>
          <img
            src="AssistantIcon.png"
            alt="Logo"
            style={{
              width: "250px",
              height: "250px",
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div
          className="w-full max-w-md p-6 flex flex-col items-center absolute left-1/2 transform -translate-x-1/2"
          style={{ top: "240px" }}
        >
          <h2 className="text-4xl font-bold mb-8 text-[#F0EAD6]">About Us</h2>
          <p className="text-center mb-8 text-lg text-[#F0EAD6]">
            We, CertifBAI, are a team of 5 students who are passionate about AI
            and its applications. <br />
            We are currently working on a project that aims to help job seekers
            to improve their resume <br />
            and increase their chances of getting hired.
          </p>
          <div className="flex space-x-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <p className="text-center text-[#F0EAD6] mt-2">John Doe</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <p className="text-center text-[#F0EAD6] mt-2">Jane Smith</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <p className="text-center text-[#F0EAD6] mt-2">Bob Johnson</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <p className="text-center text-[#F0EAD6] mt-2">Alice Brown</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <p className="text-center text-[#F0EAD6] mt-2">Charlie Davis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
