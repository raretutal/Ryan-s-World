import React, { useState, useRef, useCallback } from 'react';
import Chatbot from './Chatbot'; // Adjust the import path as needed

const API_KEY = import.meta.env.VITE_PDF_CO_API_KEY; // Replace with your PDF.co API key

/**
 * Get a presigned URL from PDF.co to upload the PDF file.
 * @param apiKey Your PDF.co API key.
 * @param fileName The name of the file to upload.
 * @returns A tuple of [uploadUrl, uploadedFileUrl].
 */
async function getPresignedUrl(apiKey: string, fileName: string): Promise<[string, string]> {
  const url = `https://api.pdf.co/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${encodeURIComponent(fileName)}`;
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers: { "x-api-key": apiKey }
  });
  const data = await response.json();
  if (data.error === false) {
    return [data.presignedUrl, data.url];
  } else {
    throw new Error("getPresignedUrl error: " + data.message);
  }
}

/**
 * Upload the selected file to the given presigned URL.
 * @param file The File object selected by the user.
 * @param uploadUrl The presigned URL provided by PDF.co.
 */
async function uploadFile(file: File, uploadUrl: string): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/octet-stream"
    },
    body: file
  });
  if (!response.ok) {
    throw new Error("uploadFile error: " + response.statusText);
  }
}

/**
 * Convert an uploaded PDF to text using PDF.co's simple endpoint.
 * @param apiKey Your PDF.co API key.
 * @param uploadedFileUrl The URL of the uploaded PDF file.
 * @returns The extracted text from the PDF.
 *
 * This function uses the /pdf/convert/to/text-simple endpoint.
 * Payload:
 * {
 *   "url": <uploadedFileUrl>,
 *   "inline": true,
 *   "async": false
 * }
 */
async function convertPdfToText(
  apiKey: string,
  uploadedFileUrl: string
): Promise<string> {
  const payload = {
    url: uploadedFileUrl,
    inline: true,
    async: false
  };

  const response = await fetch("https://api.pdf.co/v1/pdf/convert/to/text-simple", {
    method: "POST",
    mode: "cors",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (data.error === false) {
    return data.body || "";
  } else {
    throw new Error("convertPdfToText error: " + data.message);
  }
}

const ResumeReader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>(""); // Initially empty
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clicking the dashed box triggers the file input dialog.
  const handleBoxClick = useCallback(() => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    fileInputRef.current?.click();
  }, []);

  // Modified: Automatically process the file when selected.
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        setExtractedText("Processing PDF...");
        const fileName = file.name;
        const [uploadUrl, uploadedFileUrl] = await getPresignedUrl(API_KEY, fileName);
        await uploadFile(file, uploadUrl);
        const text = await convertPdfToText(API_KEY, uploadedFileUrl);
        setExtractedText(text || "No text found in PDF.");
      } catch (error: any) {
        console.error("Error processing PDF:", error);
        setExtractedText("Failed to process PDF: " + error.message);
      }
    }
  }, []);

  // Dynamic style for the upload box.
  const boxStyle = {
    background: '#E6F1FA',
    border: '2px dashed #D3D3D3',
    borderRadius: '8px',
    padding: '40px 20px',
    marginBottom: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: '300px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: isClicked
      ? 'scale(0.95)'
      : isHovered
      ? 'scale(1.05) rotate(2deg)'
      : 'scale(1) rotate(0deg)',
    boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.2)' : 'none'
  };

  return (
    <>
      {/* Main Resume Reader Container */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        {/* Header */}
        <h2 style={{ marginBottom: '10px' }}>Resume Reader</h2>
        <p style={{ color: '#555', marginBottom: '30px' }}>
          Upload resume to get feedback and suggestion with BAI
        </p>

        {/* Dynamic, cartoony dashed container for PDF upload */}
        <div
          onClick={handleBoxClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={boxStyle}
        >
          {/* Cartoony upload icon (a cloud with an upward arrow) */}
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: '10px' }}
          >
            <path
              d="M48 28C48 20.268 41.732 14 34 14C30.197 14 26.931 15.354 24.65 17.65C22.368 15.354 19.102 14 15.3 14C7.568 14 1.3 20.268 1.3 28C1.3 35.732 7.568 42 15.3 42H48C55.732 42 62 35.732 62 28C62 20.268 55.732 14 48 14V28Z"
              fill="#F0F8FF"
              stroke="#0E2F5A"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polyline
              points="32,22 32,38 26,32 32,38 38,32"
              fill="none"
              stroke="#0E2F5A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Display filename or instructions */}
          {selectedFile ? (
            <p style={{ color: '#333', margin: '0' }}>{selectedFile.name}</p>
          ) : (
            <p style={{ color: '#999', margin: '0' }}>Compatible files: PDF</p>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>

      {/* Chatbot rendered below with extracted resume text as prop */}
      <Chatbot resumeText={extractedText} />
    </>
  );
};

export default ResumeReader;
