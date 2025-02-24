import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

function ResumeReader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://your-backend-api.com/analyze", {
        method: "POST",
        headers: {
          Authorization: "Bearer YOUR_API_KEY",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const result = await response.json();
      setAnalysisResult(result.analysis);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume. Please try again.");
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h2 className="text-4xl font-bold mb-8 text-[#002833]">Resume Reader</h2>
      <div className="w-full max-w-2xl bg-gray-200 rounded-3xl p-12">
        <p className="text-center mb-8 text-lg">
          Upload resume to get feedback and suggestion with BAI
        </p>
        <div
          className="border-4 border-[#002833] border-dashed rounded-3xl p-12 flex flex-col items-center cursor-pointer"
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-[#002833] mb-4" />
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <p className="text-center text-gray-600">Compatible files: PDF</p>
        </div>
        <button
          onClick={handleAnalyzeResume}
          className="w-full mt-8 px-8 py-3 rounded-full bg-[#002833] text-white text-lg hover:bg-[#003845] transition-colors"
        >
          ANALYZE RESUME
        </button>
        {analysisResult && (
          <div className="mt-8 p-4 bg-white border border-gray-300 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Analysis Result</h3>
            <p>{analysisResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeReader;
