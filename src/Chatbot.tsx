import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot } from "react-icons/fa";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "learnlm-1.5-pro-experimental",
  systemInstruction: `
You an assistant that helps a person find the job they are most likely to get based on their resume.
Your goal is to give them a small analysis of their resume with respect to the top 5 jobs their resume closely qualifies for. You have to rate how qualified I am on a scale from 1-10
(1-3 for lacking a lot of experience,4-7 for lack a bit of experience, 8 - 10 for Qualified). 
You have to be more specific the lacking qualifications. Indicate what the scores mean, and be VERY STRICT at grading.

Your return format would be like this:

Name: (Person's Name)

Best Job You Qualify For: (Job Title)

Rating:                                                             

Already Acquired Qualifications:  (Be short and concise, like using bullet points to just list things.)

Needed Qualifications:


Other jobs that you may be qualified for:


If the person has no job that he or she is qualified for, just put what job the resume seems to be leaning towards to. and put in the requirements and courses
that person may need to take. Here is your return format, you are to do that for 3 possible jobs if you can.  Be short and concise with your answers. 

Job Title:    

Rating:                                                                                                        

Needed Qualifications (Be short and concise, like your just jotting down what the user lacks):

Links to online courses and certifications:

Do make sure that the links you return are valid and real. Make sure your answers are concise and short. And if the user chat's further, help them with their problem. Don't just repeat previous prompts.

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
  // ADDED: track whether we've finished the first analysis
  const [analysisDone, setAnalysisDone] = useState(false);

  // ADDED: store conversation in an array once analysis is done
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);

  const [input, setInput] = useState("");
  const [response, setResponse] = useState(
    "Resume uploaded successfully. You can now type your message."
  );
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

    if (!analysisDone) {
      try {
        const result = await model.generateContent([resumeText, input]);
        let fullResponse = result.response.text();
        fullResponse = formatResponse(fullResponse);
        setResponse(fullResponse);
        animateResponse(fullResponse);
        setAnalysisDone(true);
        // Explicitly type the messages
        const userMsg: { type: "user"; text: string } = { type: "user", text: input };
        const botMsg: { type: "bot"; text: string } = { type: "bot", text: fullResponse };
        setMessages([userMsg, botMsg]);
      } catch (error) {
        console.error("Error generating content:", error);
        setResponse("An error occurred while analyzing your resume. Please try again.");
      }
    } else {
      const userMsg: { type: "user"; text: string } = { type: "user", text: input };
      let botMsg: { type: "bot"; text: string } = { type: "bot", text: "" };

      try {
        const result = await model.generateContent([resumeText, input]);
        let fullResponse = result.response.text();
        fullResponse = formatResponse(fullResponse);
        botMsg.text = fullResponse;
      } catch (error) {
        console.error("Error generating content:", error);
        botMsg.text = "An error occurred while analyzing your resume. Please try again.";
      }

      setMessages((prev) => [...prev, userMsg, botMsg]);
    }

    setInput("");
    setIsLoading(false);
  };

  // Minimal formatting fix for tables/pipes:
  const formatResponse = (text: string): string => {
    return text
      .replace(/\|/g, "  ") // Fix tables/pipes
      .replace(/`/g, "") // Remove backticks
      .replace(/^Okay,? I've analyzed your resume[.!]?\s*/i, "") // Remove "Okay, I've analyzed your resume."
      .replace(/^for a .*? role[:,]?\s*/i, ""); // Remove "for a ____ role"
  };
  

  const parseMarkdown = (text: string): string => {
    // First escape any HTML characters to prevent injection
    const escapedText = text.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char] ?? char));

    // 1) Convert markdown links [label](url)
    let result = escapedText.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      (_, label, url) =>
        `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${label}</a>`
    );

    // 2) Convert raw URLs (http:// or https://) only if not already inside an anchor tag.
    result = result.replace(
      /(?<!<a href=")(https?:\/\/(?:(?!<\/a>)[^\s])+)/g,
      (url) =>
        `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${url}</a>`
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
    fontFamily: "Google Sans, sans-serif",
    fontSize: "24px",
    textAlign: "left",
    margin: 0,
  };

  // Messaging UI styles (used after analysis is done)
  const chatContainerStyle: React.CSSProperties = {
    width: "90vw",
    padding: "20px",
    backgroundColor: "#F9F9F9",
    position: "relative",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered ? "0 8px 16px rgba(31, 20, 180, 0.31)" : "none",
  };

  const messageStyle = (type: "user" | "bot"): React.CSSProperties => ({
    backgroundColor: type === "user" ? "#DCF8C6" : "#FFFFFF",
    padding: "10px 15px",
    borderRadius: "10px",
    maxWidth: "70%",
    alignSelf: type === "user" ? "flex-end" : "flex-start",
    fontFamily: "Google Sans, sans-serif",
    fontSize: "20px",
    textAlign: "left",
    margin: "5px 0",
    whiteSpace: "pre-wrap",
  });

  // Render: if analysis not done, show original UI; otherwise, show messaging UI.
  if (!analysisDone) {
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
              // ADDED: Enter key triggers handleSend
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
          <div
            className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded"
            style={bubbleContainerStyle}
          >
            <p
              style={responseStyle}
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(displayedResponse),
              }}
            ></p>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div
        style={chatContainerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center mb-4">
          <FaRobot className="text-2xl mr-2" />
          <h3 className="text-2xl font-bold">Chat with BAI</h3>
        </div>

        <div
          className="chat-messages"
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={messageStyle(msg.type)}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
            />
          ))}
        </div>

        <div className="mb-4 flex flex-col items-center w-full" style={{ marginTop: "10px" }}>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded"
            style={{
              width: "100%",
              minHeight: "50px",
              textAlign: "left",
              resize: "none",
              overflowWrap: "break-word",
            }}
            // ADDED: Enter key triggers handleSend
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="w-full bg-darkBlue text-white py-2 mt-2 rounded">Send</button>
        </div>

        <button
          onClick={handleSend}
          className="w-full px-4 py-2 bg-[#002833] text-white rounded"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
    );
  }
};

export default Chatbot;