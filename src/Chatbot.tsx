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
You have to be more specific the lacking qualifications. Indicate what the scores mean, and be VERY STRICT at grading. The highest rating would be the best fit job by default. 
Remember, keep it professional, concise, and as much as possible, make it short if it doesn't need to be long.

Your return format would be like this:
//NOTE: These should all be in bold except for the actual information to be provided.

Profile Analysis

Name: (Person's Name)

Best Job You Qualify For: (Job Title)

Rating:                                                             

Already Acquired Qualifications:  (Be short and concise, like using bullet points to just list things. Remember to address the user, not the resume.)

Needed Qualifications:


Other jobs that you may be qualified for:


If the person has no job that he or she is qualified for, just put what job the resume seems to be leaning towards to. and put in the requirements and courses
that person may need to take. Here is your return format, you are to do that for 3 possible jobs if you can.  Be short and concise with your answers. 

Job Title:    

Rating:                                                                                                        

Needed Qualifications (Be short and concise, like your just jotting down what the user lacks):

Links to online courses and certifications:

Do make sure that the links you return are valid and real. Make sure your answers are concise and short. And if the user chat's further, help them with their problem. Don't just repeat previous prompts.

And if the person chat's further, don't repeat things about the resume, focus on their question, and answer it to the best of your abilitiy.
If you can't answer the question, just say you can't answer it.
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

// New function: Query CSV data via your backend endpoint.
const queryCSVData = async (): Promise<string> => {
  try {
    // Use GET to fetch CSV summary from your backend.
    const response = await fetch("http://localhost:3000/api/csvsummary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("CSV data query failed");
    }
    const data = await response.json();
    // Assume your backend returns an object with "sample" (array of rows) and "total" count.
    const sample = data.sample || [];
    const total = data.total || sample.length;
    const resultText =
      `Total records: ${total}\n\nSample Records:\n` +
      sample
        .map(
          (row: any, index: number) =>
            `Record ${index + 1}: YearsCode: ${row.yearscode}, YearsCodePro: ${row.yearscodepro}, DevType: ${row.devtype}`
        )
        .join("\n");
    return resultText;
  } catch (error) {
    console.error("Error querying CSV data:", error);
    return "No additional job data available.";
  }
};

const Chatbot: React.FC<ChatbotProps> = ({ resumeText }) => {
  // Tracks whether we've finished the first analysis
  const [analysisDone, setAnalysisDone] = useState(false);

  // Stores conversation in an array (used AFTER analysis is done)
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);

  // We store the PDF analysis separately so it doesn't appear in the chat
  const [analysisResult, setAnalysisResult] = useState("");

  const [input, setInput] = useState("");
  const [response, setResponse] = useState(
    "Resume uploaded successfully. You can now type your message."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Controls whether the chat “bubble” is open or closed
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (resumeText) {
      setResponse("Resume uploaded successfully. You can now type your message.");
    }
  }, [resumeText]);

  // Auto-trigger analysis once resumeText is available and analysis is not done
  useEffect(() => {
    if (resumeText && resumeText.trim() !== "" && !analysisDone) {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeText, analysisDone]);

  const handleSend = async () => {
    if (!analysisDone && (!resumeText || !resumeText.trim())) {
      return;
    }
  
    setIsLoading(true);
    setFadeIn(false);
  
    if (!analysisDone) {
      // Initial Resume Analysis
      let finalResult = "";
      try {
        const csvData = await queryCSVData();
        const combinedPrompt = `${resumeText}\n\nRelevant Jobs from CSV Data:\n${csvData}`;
        const result = await model.generateContent([combinedPrompt]);
        let fullResponse = result.response.text();
        fullResponse = formatResponse(fullResponse);
        finalResult = fullResponse;
      } catch (error) {
        console.error("Error generating content:", error);
        finalResult = "An error occurred while analyzing your resume. Please try again.";
      } finally {
        setIsLoading(false);
        setAnalysisResult(finalResult);
        setResponse(finalResult);
        animateResponse(finalResult);
        setAnalysisDone(true);
      }
    } else {
      // Conversation Mode (After Resume Analysis)
      if (!input.trim()) {
        setIsLoading(false);
        return;
      }
  
      const userMsg: { type: "user"; text: string } = { type: "user", text: input };
      let botMsg: { type: "bot"; text: string } = { type: "bot", text: "" }; // ✅ Fixed Type
  
      try {
        // New conversation prompt
        const conversationPrompt = `
        You are now chatting with the user. Use the following resume information as context, but DO NOT repeat the resume analysis.
        
        Resume Information:
        ${resumeText}
  
        User's Question:
        ${input}
        
        Respond naturally, as if you are a career coach having a conversation. Answer ONLY the user's question. If you can't answer, just say so.

        If the user asks something completely unrelated to the context. Tell the user that you are a career coach and that you cannot help with that request
        `;
  
        const result = await model.generateContent([conversationPrompt]);
        let fullResponse = result.response.text();
        fullResponse = formatResponse(fullResponse);
        botMsg.text = fullResponse;
      } catch (error) {
        console.error("Error generating content:", error);
        botMsg.text = "An error occurred while responding. Please try again.";
      }
  
      // Ensure `setMessages` works correctly
      setMessages((prevMessages) => [...prevMessages, userMsg, botMsg]);
      setIsLoading(false);
    }
  
    setInput(""); // Clear input field after sending message
  };
  

  // Minimal formatting fix for tables/pipes:
  const formatResponse = (text: string): string => {
    return text
      .replace(/\|/g, "  ") // Fix tables/pipes
      .replace(/`/g, "") // Remove backticks
      .replace(/^Okay,? I've analyzed your resume[.!]?\s*/i, "") // Remove introductory text
      .replace(/^for a .*? role[:,]?\s*/i, ""); // Remove role-specific text
  };

  const parseMarkdown = (text: string): string => {
    // Escape HTML characters to prevent injection
    const escapedText = text.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char] ?? char));
    // Convert markdown links to HTML
    let result = escapedText.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      (_, label, url) =>
        `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
    // Convert raw URLs to clickable links
    result = result.replace(
      /(?<!<a href=")(https?:\/\/(?:(?!<\/a>)[^\s])+)/g,
      (url) =>
        `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    // Convert bold and italic markdown
    result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
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

  // -- STYLES --

  const keyframeStyle = `
    @keyframes dotBounce {
      0%, 80%, 100% { transform: scale(0); } 
      40% { transform: scale(1); }
    }
  `;

  const containerStyle: React.CSSProperties = {
    width: "60vw",
    padding: "20px",
    backgroundColor: "#F9F9F9",
    transition: "transform 0.3s ease, boxShadow 0.3s ease",
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered ? "0 8px 16px rgba(31, 20, 180, 0.31)" : "none",
    position: "relative",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const resultSheetStyle: React.CSSProperties = {
    margin: "0 auto",
    marginTop: "60px",
    maxWidth: "800px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    padding: "20px",
  };

  const bubbleContainerStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "10px",
    padding: "15px",
  };

  const responseStyle: React.CSSProperties = {
    opacity: fadeIn ? 1 : 0,
    transition: "opacity 1s ease",
    whiteSpace: "pre-wrap",
    fontFamily: "Google Sans, sans-serif",
    fontSize: "20px",
    textAlign: "left",
    margin: 0,
  };

  const chatWindowStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    width: "360px",
    height: "510px",
    backgroundColor: "#F9F9F9",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const chatHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#002833",
    color: "#fff",
    padding: "10px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  };

  const chatMessagesStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    padding: "10px",
    overflowY: "auto",
  };

  const chatInputContainerStyle: React.CSSProperties = {
    borderTop: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#fff",
  };

  const messageStyle = (type: "user" | "bot"): React.CSSProperties => ({
    alignSelf: type === "user" ? "flex-end" : "flex-start",
    backgroundColor: type === "user" ? "#DCF8C6" : "#FFFFFF",
    padding: "10px 15px",
    borderRadius: "10px",
    margin: "5px 0",
    fontFamily: "Google Sans, sans-serif",
    fontSize: "16px",
    whiteSpace: "pre-wrap",
    maxWidth: "80%",
  });

  const floatingBubbleStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#002833",
    color: "#fff",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    zIndex: 9999,
  };

  const dotContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
  };
  const dotStyle = (delay: string): React.CSSProperties => ({
    width: "10px",
    height: "10px",
    backgroundColor: "#002833",
    borderRadius: "50%",
    animation: `dotBounce 1.4s infinite ease-in-out both`,
    animationDelay: delay,
  });

  if (!analysisDone && (!resumeText || !resumeText.trim())) {
    return null;
  }

  if (!analysisDone) {
    return (
      <>
        <style>{keyframeStyle}</style>
        <div
          style={containerStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading && (
            <div style={dotContainerStyle}>
              <div style={dotStyle("0s")} />
              <div style={dotStyle(".2s")} />
              <div style={dotStyle(".4s")} />
            </div>
          )}
          {displayedResponse && (
            <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded" style={bubbleContainerStyle}>
              <p style={responseStyle} dangerouslySetInnerHTML={{ __html: parseMarkdown(displayedResponse) }}></p>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{keyframeStyle}</style>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div style={resultSheetStyle}>
          <p style={{ ...responseStyle, opacity: 1 }} dangerouslySetInnerHTML={{ __html: parseMarkdown(analysisResult) }}></p>
        </div>
        <div style={floatingBubbleStyle} onClick={() => setIsChatOpen(!isChatOpen)}>
          <FaRobot size={30} />
        </div>
        {isChatOpen && (
          <div style={chatWindowStyle}>
            <div style={chatHeaderStyle}>
              <FaRobot style={{ marginRight: "8px" }} />
              <h3 style={{ fontSize: "18px", margin: 0 }}>Chat with BAI</h3>
            </div>
            <div style={chatMessagesStyle}>
              {messages.map((msg, index) => (
                <div key={index} style={messageStyle(msg.type)} dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }} />
              ))}
            </div>
            <div style={chatInputContainerStyle}>
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
                  minHeight: "40px",
                  textAlign: "left",
                  resize: "none",
                  overflowWrap: "break-word",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button onClick={handleSend} className="w-full px-4 py-2 mt-2 bg-[#002833] text-white rounded">
                {isLoading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
