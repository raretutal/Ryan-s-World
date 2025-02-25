import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot } from "react-icons/fa";

const genAI = new GoogleGenerativeAI("AIzaSyBImsQJQfhfYGoPtuPIccEt3THC3dTDPJY");
const generationConfig = {
  temperature: 0.75,
  topP: 1,
  topK: 1,
  maxOutputTokens: 5000,
};

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig });

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    setIsLoading(true);
    setDisplayedResponse([]);
    const result = await model.generateContent(input);
    const responseText = result.response.text();
    setResponse(responseText);
    setIsLoading(false);
  };

  useEffect(() => {
    if (response) {
      setDisplayedResponse([]); // Reset displayedResponse before starting the animation
      const words = response.split(" ");
      let index = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedResponse((prev) => [...prev, words[index]]);
        index++;
        if (index === words.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 75); // Adjust the speed of the fade-in animation here
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [response]);

  return (
    <div className="w-full p-4 bg-white border border-gray-300 rounded-lg">
      <div className="flex items-center mb-4">
        <FaRobot className="text-2xl mr-2" />
        <h3 className="text-2xl font-bold">Chat with BAI</h3>
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Ask me anything..."
      />
      <button
        onClick={handleSend}
        className="w-full px-4 py-2 bg-[#002833] text-white rounded hover:bg-[#003845] transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Thinking..." : "Send"}
      </button>
      <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded break-words whitespace-pre-wrap">
        {isLoading && <p>Thinking...</p>}
        <p>
          {displayedResponse.map((word, index) => (
            <span key={index} className="fade-in">{word} </span>
          ))}
        </p>
      </div>
      <style>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.5s forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;