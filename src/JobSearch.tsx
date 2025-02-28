import React, { useState, useEffect } from "react";

function JobSearch() {
  const [jobTitle, setJobTitle] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [jobLinks, setJobLinks] = useState<string[]>([]);
  const handleSearch = () => {
    // Placeholder for search functionality
    console.log(`Searching for ${jobTitle} jobs, sorted by ${sortBy}`);
  };

  //activate the webscraping function from server.js
  useEffect(() => {
    fetch("http://localhost:5000/api/job-links")
      .then((response) => response.json())
      .then((data) => setJobLinks(data.jobLinks)) // 👈 Update state with job links
      .catch((error) => console.error("Error fetching job links:", error));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-12">
      {/* Display Job Listings */}
      <div className="p-6 bg-gray-300">
        <h2 className="text-xl font-semibold">Job Listings</h2>

        {/*This is the essential block, it makes an unordered list of the links scraped from jobstreet*/}
        <ul>
          {jobLinks.length > 0 ? (
            jobLinks.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))
          ) : (
            <p>Loading job links...</p>
          )}
        </ul>
      </div>

      <h2 className="text-5xl font-bold mb-12 text-[#002833]">Job Search</h2>
      <div className="bg-gray-200 p-8 rounded mb-12 w-full max-w-2xl">
        <p className="text-center text-xl text-gray-700 mb-6">
          Use our job search tool to find your next job or internship that match
          your skills and career goals.
        </p>
        <div className="mb-6 w-full">
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-6 py-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#002833]"
          />
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-6 py-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#002833] appearance-none"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="location">Sort by Nearest Location</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full px-6 py-3 bg-[#002833] text-white rounded hover:bg-[#004d66] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002833]"
        >
          Search Jobs
        </button>
      </div>
    </div>
  );
}

export default JobSearch;
