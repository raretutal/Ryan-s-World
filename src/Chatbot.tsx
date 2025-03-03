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
Remember, keep it professional, concise, and as much as possible, make it short if it doesn't need to be long.

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

And if the person chat's further, don't repeat things about the resume, focus on their question, and answer it to the best of your abilitiy.
As much as possible, you must not sound repetitive. If you can't answer the question, just say you can't answer it.

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

// New function: Query Astra DB for relevant job data based on the resume text.
const queryAstraDB = async (resumeText: string): Promise<string> => {
  const astraToken = import.meta.env.VITE_ASTRA_DB_TOKEN;
  const keyspace = import.meta.env.VITE_ASTRA_KEYSPACE;

  // Updated CQL query to select the new columns and set the LIMIT to 500.
  const query = {
    cql: `
      SELECT EdLevel, YearsCode, YearsCodePro, DevType,
             LanguageHaveWorkedWith, DatabaseHaveWorkedWith,
             PlatformHaveWorkedWith, WebframeHaveWorkedWith
      FROM ${keyspace}.developer_profiles
      LIMIT 500;
    `
  };

  try {
    // Updated fetch URL to use the Vite proxy and the new table name
    const response = await fetch(
      `/astra/api/rest/v2/keyspaces/${keyspace}/developer_profiles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cassandra-Token": astraToken,
        },
        body: JSON.stringify(query),
      }
    );

    if (!response.ok) {
      throw new Error("Astra DB query failed");
    }

    const data = await response.json();
    const rows = data.data;

    if (!rows || rows.length === 0) {
      return "No matching profiles found in Astra DB.";
    }

    const resultText = rows
      .map(
        (row: any) =>
          `EdLevel: ${row.EdLevel}, YearsCode: ${row.YearsCode}, YearsCodePro: ${row.YearsCodePro}, DevType: ${row.DevType}, Languages: ${row.LanguageHaveWorkedWith}, Databases: ${row.DatabaseHaveWorkedWith}, Platforms: ${row.PlatformHaveWorkedWith}, Webframes: ${row.WebframeHaveWorkedWith}`
      )
      .join("\n\n");

    return resultText;
  } catch (error) {
    console.error("Error querying Astra DB:", error);
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
    // If there's no resume text and analysis is not done, do nothing
    if (!analysisDone && (!resumeText || !resumeText.trim())) {
      return;
    }
    setIsLoading(true);
    setFadeIn(false);

    if (!analysisDone) {
      // Initial PDF analysis
      let finalResult = "";
      try {
        // Query Astra DB for relevant job data
        const jobData = await queryAstraDB(resumeText);
        // Combine resume text with Astra DB results
        const combinedPrompt = `${resumeText}\n\nRelevant Jobs from Astra DB:\n${jobData}`;

        const result = await model.generateContent([combinedPrompt]);
        let fullResponse = result.response.text();
        fullResponse = formatResponse(fullResponse);

        // Store in local var, but don't display yet
        finalResult = fullResponse;
      } catch (error) {
        console.error("Error generating content:", error);
        finalResult = "An error occurred while analyzing your resume. Please try again.";
      } finally {
        // Now that it's fully processed, set states and show
        setIsLoading(false);
        setAnalysisResult(finalResult);
        setResponse(finalResult);
        animateResponse(finalResult);
        setAnalysisDone(true);
      }
    } else {
      // Conversation mode after the initial analysis
      if (!input.trim()) {
        setIsLoading(false);
        return;
      }
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
      setIsLoading(false);
    }
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

  //
  // -- STYLES --
  //

  // Keyframes for the 3-dot bounce animation
  const keyframeStyle = `
    @keyframes dotBounce {
      0%, 80%, 100% {
        transform: scale(0);
      } 
      40% {
        transform: scale(1);
      }
    }
  `;

  // The initial container for the upload phase
  const containerStyle: React.CSSProperties = {
    width: "60vw",
    padding: "20px",
    backgroundColor: "#F9F9F9",
    transition: "transform 0.3s ease, boxShadow: 0.3s ease",
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered ? "0 8px 16px rgba(31, 20, 180, 0.31)" : "none",
    position: "relative",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // A “sheet” or “paper” for the final PDF analysis, centered on the page
  // (slightly wider than before)
  const resultSheetStyle: React.CSSProperties = {
    margin: "0 auto",
    marginTop: "60px",
    maxWidth: "800px", // a bit wider
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    padding: "20px",
  };

  // Style for the text bubble in the initial container
  const bubbleContainerStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "10px",
    padding: "15px",
  };

  // The text itself
  const responseStyle: React.CSSProperties = {
    opacity: fadeIn ? 1 : 0,
    transition: "opacity 1s ease",
    whiteSpace: "pre-wrap",
    fontFamily: "Google Sans, sans-serif",
    fontSize: "20px",
    textAlign: "left", // left-aligned text
    margin: 0,
  };

  // A slightly bigger “portal” style for the chat window
  const chatWindowStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    width: "360px", // +10 px
    height: "510px", // +10 px
    backgroundColor: "#F9F9F9",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  // Chat header style
  const chatHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#002833",
    color: "#fff",
    padding: "10px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  };

  // The messages area inside the chat window
  const chatMessagesStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    padding: "10px",
    overflowY: "auto",
  };

  // Input area at the bottom of the chat
  const chatInputContainerStyle: React.CSSProperties = {
    borderTop: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#fff",
  };

  // Style for each message
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

  // Floating bubble (always shown)
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
    zIndex: 9999, // so it floats above other elements
  };

  // Dot container + each dot style
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

  //
  // -- RENDER --
  //

  // If there's no resumeText at all, show nothing
  if (!analysisDone && (!resumeText || !resumeText.trim())) {
    return null;
  }

  // 1) If analysis is NOT done yet, show the initial container + dot animation if isLoading
  if (!analysisDone) {
    return (
      <>
        {/* Keyframe definition for the dot bounce animation */}
        <style>{keyframeStyle}</style>

        <div
          style={containerStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* If we are loading/processing the PDF, show the 3-dot animation */}
          {isLoading && (
            <div style={dotContainerStyle}>
              <div style={dotStyle("0s")} />
              <div style={dotStyle(".2s")} />
              <div style={dotStyle(".4s")} />
            </div>
          )}

          {/* This bubble container shows the "analysis in progress" or initial message */}
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
      </>
    );
  }

  // 2) Analysis is done -> Show the separate “sheet” with results, plus the floating chat bubble
  return (
    <>
      <style>{keyframeStyle}</style>

      <div style={{ position: "relative", minHeight: "100vh" }}>
        {/* The PDF analysis on a “sheet,” centered */}
        <div style={resultSheetStyle}>
          <p
            style={{
              ...responseStyle,
              opacity: 1,
            }}
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(analysisResult),
            }}
          ></p>
        </div>

        {/* Floating bubble (always visible). Click toggles the chat */}
        <div
          style={floatingBubbleStyle}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <FaRobot size={30} />
        </div>

        {/* If chat is open, show the “portal” chat window */}
        {isChatOpen && (
          <div style={chatWindowStyle}>
            <div style={chatHeaderStyle}>
              <FaRobot style={{ marginRight: "8px" }} />
              <h3 style={{ fontSize: "18px", margin: 0 }}>Chat with BAI</h3>
            </div>

            <div style={chatMessagesStyle}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={messageStyle(msg.type)}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                />
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
              <button
                onClick={handleSend}
                className="w-full px-4 py-2 mt-2 bg-[#002833] text-white rounded"
              >
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
