import React from 'react';
import { Upload } from 'lucide-react';

function ResumeReader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h2 className="text-4xl font-bold mb-8 text-[#002833]">Resume Reader</h2>
      <div className="w-full max-w-2xl bg-gray-200 rounded-3xl p-12">
        <p className="text-center mb-8 text-lg">
          Upload resume to get feedback and suggestion with BAI
        </p>
        <div className="border-4 border-[#002833] border-dashed rounded-3xl p-12 flex flex-col items-center">
          <Upload className="w-16 h-16 text-[#002833] mb-4" />
          <p className="text-center text-gray-600">
            compatible files blah blah
          </p>
        </div>
        <button className="w-full mt-8 px-8 py-3 rounded-full bg-[#002833] text-white text-lg hover:bg-[#003845] transition-colors">
          ANALYZE RESUME
        </button>
      </div>
    </div>
  );
}

export default ResumeReader;