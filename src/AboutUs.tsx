import React from "react";

function AboutUs() {
  return (
    <div className="container-fluid">
      <div
        className="bg-[#002833] md:h-[1800px]xl:h-[1600px] relative"
        style={{ top: "30px" }}
      >
        <div className="w-full bg-white relative z-20" style={{ top: "-23px" }}>
          <img
            src="AssistantIcon.png"
            alt="Logo"
            style={{
              width: "250px",
              height: "230px",
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div className="w-full p-12">
          <h2 className="sm: text-2xl md: text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 text-[#F0EAD6]">
            About Us
          </h2>
          <p className="text-[#F0EAD6] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-left">
            We, CertifBAI, are a team of 5 students from the University of the
            Philipines who are passionate about AI and its applications. Coming
            from our own worries regarding our future occupations, we are
            working on a project that aims to help job seekers in the IT
            industry to improve their resume and increase their chances of
            getting hired in this competitive field.
          </p>
        </div>
        <div className="w-full flex justify-center">
          <hr className="min-w-[90%] m-3 border-t-2 border-white" />
        </div>
        <div className="w-full p-12">
          <h2 className="sm: text-2xl md: text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 text-[#F0EAD6]">
            Objective
          </h2>
          <p className="text-[#F0EAD6] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-left">
            The app helps users improve their resume formatting and presentation
            while providing mentor-like AI (BAI) for career guidance. It
            simplifies job and internship searches and assists users in becoming
            more qualified by recommending free certification sites and
            identifying skill gaps based on job requirements.
          </p>
        </div>
        <div className="w-full flex justify-center">
          <hr className="min-w-[90%] m-3 border-t-2 border-white" />
        </div>
        <div className="w-full p-12">
          <h2 className="sm: text-2xl md: text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 text-[#F0EAD6]">
            Goal
          </h2>
          <p className="text-[#F0EAD6] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-left">
            To contribute into reducing the increasing unemployment rate and
            addressing the underemployment issues prevalent in the IT industry
            due to a highly competitive workforce and the frequent emergence of
            new tech that renders current skills obsolote.
          </p>
        </div>
        <h2 className="mt-8 sm: text-2xl md: text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 text-[#F0EAD6] text-center">
          Team Members:
        </h2>
        <div className="w-full flex justify-center flex-wrap space-x-8">
          <div className="d-flex align-items-center mx-2">
            <img
              src="beduya.png"
              alt="Russell Beduya"
              className="w-28 h-28 bg-gray-300 rounded-full mb-4"
            />
            <p className="text-center text-[#F0EAD6] mt-2">
              Russell <br />
              Beduya
            </p>
          </div>
          <div className="d-flex align-items-center mx-2">
            <img
              src="retutal.png"
              alt="Ryan Retutal"
              className="w-28 h-28 bg-gray-300 rounded-full mb-4"
            />
            <p className="text-center text-[#F0EAD6] mt-2">
              Ryan <br />
              Retutal
            </p>
          </div>
          <div className="d-flex align-items-center mx-2">
            <img
              src="senagan.png"
              alt="George Senagan"
              className="w-28 h-28 bg-gray-300 rounded-full mb-4"
            />
            <p className="text-center text-[#F0EAD6] mt-2">
              George <br />
              Senagan
            </p>
          </div>
          <div className="d-flex align-items-center mx-2">
            <img
              src="rico.png"
              alt="Dexter Rico"
              className="w-28 h-28 bg-gray-300 rounded-full mb-4"
            />
            <p className="text-center text-[#F0EAD6] mt-2">
              Dexter
              <br /> Rico
            </p>
          </div>
          <div className="d-flex align-items-center mx-2">
            <img
              src="ponce.png"
              alt="Hans Ponce"
              className="w-28 h-28 bg-gray-300 rounded-full mb-4"
            />
            <p className="text-center text-[#F0EAD6] mt-2">
              Hans
              <br /> Ponce
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
