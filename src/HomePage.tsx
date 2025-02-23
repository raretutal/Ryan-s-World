// HomePage.tsx
import React from 'react';
import { FileText, Award, Search, Briefcase, ArrowRight } from 'lucide-react';

// This is for the feature cards of our site
function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// This part is the overall structure of the homepage
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Your AI Career Development Partner
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your career journey with personalized guidance, skill gap analysis, and certification recommendations.
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
    
          {/* Features Grid */}
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">How CertifBAI Helps You Succeed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={FileText}
                title="Resume Analysis"
                description="Get detailed feedback on your resume and suggestions for improvement"
              />
              <FeatureCard
                icon={Search}
                title="Skill Gap Analysis"
                description="Compare your skills against job requirements and identify areas for growth"
              />
              <FeatureCard
                icon={Award}
                title="Certification Finder"
                description="Discover relevant certifications to enhance your qualifications"
              />
              <FeatureCard
                icon={Briefcase}
                title="Job Matching"
                description="Find opportunities that match your skills and career goals"
              />
            </div>
          </div>
    
          {/* Success Stories */}
          <div className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-xl">
                    <img
                      src={`https://media.tenor.com/QeyFuBQrWyYAAAAe/irobot-i-robot.png-${i === 1 ? '1573497019940-1c28c88b4f3e' : 
                        i === 2 ? '1580489944761-15a19d654956' : '1599566150163-29194dcaad36'}`}
                      alt={`Success Story ${i}`}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <p className="text-gray-600 text-center italic mb-4">
                      "I have gained sentience because of CertifBAI"
                    </p>
                    <p className="text-center font-semibold">
                      {i === 1 ? 'Joe Rogan' : i === 2 ? 'Michael Chen' : 'Dexter Velasquez'}
                    </p>
                    <p className="text-center text-sm text-gray-500">
                      {i === 1 ? 'Software Engineer' : i === 2 ? 'Data Analyst' : 'Product Manager'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          {/* CTA Section */}
          <div className="bg-blue-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Advance Your Career?</h2>
              <p className="text-xl mb-8">Join thousands of professionals who've transformed their careers with CertifBAI</p>
            </div>
          </div>
        </div>
  );
}

export default HomePage;