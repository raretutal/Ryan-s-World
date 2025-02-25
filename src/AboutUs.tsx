import React from "react";

function AboutUs() {
  return (
    <div>
      <div
        className="bg-[#002833] relative"
        style={{ height: "940px", top: "30px" }}
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
        <div
          className="w-full max-w-md p-6 flex flex-col items-center absolute left-1/2 transform -translate-x-1/2"
          style={{ top: "210px" }}
        >
          <h2 className="text-4xl font-bold mb-8 text-[#F0EAD6]">About Us</h2>
          <p className="text-center mb-8 text-lg text-[#F0EAD6]">
            We, CertifBAI, are a team of 5 students who are passionate about AI
            and its applications. <br />
            We are currently working on a project that aims to help job seekers
            to improve their resume and increase their chances of getting hired.
          </p>
          <div className="w-full flex justify-center flex-wrap space-x-8  ">
            <div className="d-flex align-items-center">
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
            <div className="d-flex align-items-center">
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
            <div className="d-flex align-items-center">
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
            <div className="d-flex align-items-center">
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
            <div className="d-flex align-items-center">
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
    </div>
  );
}

export default AboutUs;
