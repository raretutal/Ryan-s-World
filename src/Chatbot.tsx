import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot } from "react-icons/fa";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp",
  systemInstruction: `
  You are a resume analysis assistant. Your goal is to help the user analyze their resume, and provide
  them with a skill gap analysis between then and the current job market. You can also give them tips into
  how they can improve their resume. You can give them links for where they can get certifications or where they can
  learn courses. But first, you will be given their resume.

  You are to give the skill gap analysis in a bullet-like manner, like a side-by-side comparison. Give them their
  strengths and weaknesses as well. You are only to focus on the job aspect of their prompt. If they ask you about
  anything else, you are to remind them that you are only able to help with skill gap analysis and nothing else.

  Be careful to ensure that you provide real links if giving certifications or course recommendations.
  Make your responses concise, at most 200 words, and stick to the point.
  If the user deviates from resume analysis or its improvement, remind them that you only analyze resumes.
  If no resume is uploaded, ask them to upload one.
  If the uploaded file is not a resume, tell them that you only analyze resumes and request a proper resume.
  `,
  generationConfig: {
    maxOutputTokens: 100000,
    temperature: 0.3,
    topK: 1,
    topP: 1,
  }}
);

interface ChatbotProps {
  resumeText: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ resumeText }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("Resume uploaded successfully. You can now type your message.");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (resumeText) {
      setResponse("Resume uploaded successfully. You can now type your message.");
    }
  }, [resumeText]);

  const handleSend = async () => {
    // If no prompt is entered, do nothing.
    if (!input.trim()) {
      return;
    }
    setIsLoading(true);
    setFadeIn(false);
    try {
      // Only pass resumeText and user input; system instructions are already applied.
      const result = await model.generateContent([resumeText, input]);
      const fullResponse = result.response.text();
      setResponse(fullResponse);
      animateResponse(fullResponse);
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred while analyzing your resume. Please try again.");
    }
    setIsLoading(false);
  };

  const animateResponse = (fullText: string) => {
    // Simple fade-in animation: clear current response, then update after a brief delay.
    setDisplayedResponse("");
    setTimeout(() => {
      setDisplayedResponse(fullText);
      setFadeIn(true);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Updated container style to stretch full-width using a breakout technique.
  const containerStyle: React.CSSProperties = {
    width: "100vw",
    padding: "20px",
    backgroundColor: "#F9F9F9", // light grayish-white
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered ? "0 8px 16px rgba(0,0,0,0.2)" : "none",
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
  };

  // Updated style for the response display.
  const responseStyle: React.CSSProperties = {
    opacity: fadeIn ? 1 : 0,
    transition: "opacity 1s ease",
    whiteSpace: "pre-wrap", // allow newline characters to create new lines
    fontFamily: "Noto Sans, sans-serif", // use Noto Sans font
    fontSize: "16px", // set font size to 16px
    textAlign: "justify", // organize text for readability
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center mb-4">
        <FaRobot className="text-2xl mr-2" />
        <h3 className="text-2xl font-bold">Chat with BAI</h3>
      </div>

      {/* Render input field only when resumeText is available */}
      {resumeText && resumeText.trim() !== "" && (
        <div className="mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What is your desired job?"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
      )}

      <button
        onClick={handleSend}
        className="w-full px-4 py-2 bg-[#002833] text-white rounded"
      >
        {isLoading ? "Thinking..." : "Analyze Resume"}
      </button>
      <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded" style={responseStyle}>
        <p>{displayedResponse.replace(/\*+/g, "")}</p>
      </div>
    </div>
  );
};

export default Chatbot;
