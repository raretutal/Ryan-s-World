import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot } from "react-icons/fa";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp",
  systemInstruction: `
  You are a resume analysis assistant. Your goal is to help the user analyze their resume, and provide
  them with a skill gap analysis between them and the current job market. You can also give them tips into
  how they can improve their resume. You can give them links for where they can get certifications or where they can
  learn courses. But first, you will be given their resume, and they will give you their desired job.

  You are to make your prompt concise, and short. You have to make sure that your response is cohesive, and that it is easy to extarct
  Dont output in a table like manner. Just utilize bullet points to organize information properly
  
  Be careful and double check to ensure that you provide real links if giving certifications or course recommendations. We want our user to be directed there easily. The links should also be specific. For example, if you are recommending a course on Coursera, provide the link to the course directly, not just the homepage of Coursera. 
  
  Make your responses concise, at most 400 words, and stick to the point.
  If the user deviates from resume analysis or its improvement, remind them that you only analyze resumes.
  If no resume is uploaded, ask them to upload one.
  If the uploaded file is not a resume, tell them that you only analyze resumes and request a proper resume.
  `,
  generationConfig: {
    maxOutputTokens: 100000,
    temperature: 0.4,
    topK: 1,
    topP: 0.5,
  },
});

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
    if (!input.trim()) {
      return;
    }
    setIsLoading(true);
    setFadeIn(false);
    try {
      const result = await model.generateContent([resumeText, input]);
      let fullResponse = result.response.text();
      fullResponse = formatResponse(fullResponse);
      setResponse(fullResponse);
      animateResponse(fullResponse);
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred while analyzing your resume. Please try again.");
    }
    setIsLoading(false);
  };

  // Minimal formatting fix for tables/pipes:
  const formatResponse = (text: string): string => {
    return text.replace(/\|/g, "  ").replace(/`/g, "");
  };

  const parseMarkdown = (text: string): string => {
    // First escape any HTML characters to prevent injection
    const escapedText = text.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char] ?? char)); // Return original char if not found
  
    // 1) Convert markdown links [label](url)
    let result = escapedText.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      (_, label, url) => `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
  
    // 2) Convert raw URLs (http:// or https://) only if not already inside an anchor tag.
    // The negative lookahead ensures trailing "</a>" is not captured.
    result = result.replace(
      /(?<!<a href=")(https?:\/\/(?:(?!<\/a>)[^\s])+)/g,
      (url) => `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  
    // 3) Convert **bold** to <strong>bold</strong>
    result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
    // 4) Convert *italic* to <em>italic</em>
    result = result.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
    return result;
  };

  const animateResponse = (fullText: string) => {
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

  // Container style (unchanged)
  const containerStyle: React.CSSProperties = {
    width: "60vw",
    padding: "20px",
    backgroundColor: "#F9F9F9",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered ? "0 8px 16px rgba(31, 20, 180, 0.31)" : "none",
    position: "relative",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // Style for the text bubble (unchanged)
  const bubbleContainerStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "10px",
    padding: "15px",
  };

  // Updated style for the response text (unchanged)
  const responseStyle: React.CSSProperties = {
    opacity: fadeIn ? 1 : 0,
    transition: "opacity 1s ease",
    whiteSpace: "pre-wrap",
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "32px",
    textAlign: "left",
    margin: 0,
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

      {resumeText && resumeText.trim() !== "" && (
        <div className="mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What is your desired job?"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            style={{ width: "500px", height: "50px", textAlign: "center" }}
          />
        </div>
      )}

      <button
        onClick={handleSend}
        className="w-full px-4 py-2 bg-[#002833] text-white rounded"
      >
        {isLoading ? "Thinking..." : "Analyze Resume"}
      </button>

      {displayedResponse && (
        <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded" style={bubbleContainerStyle}>
          <p
            style={responseStyle}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(displayedResponse) }}
          ></p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
