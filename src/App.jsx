import { useState } from "react";
import AnimatedBackground from "./AnimatedBackground";
import ContactForm from "./ContactForm";

export default function App() {
  const [activeTab, setActiveTab] = useState("projects"); // Default active tab
  const [showContactInfo, setShowContactInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-blue-500 text-white overflow-auto">
      {/* About Me Section */}
      <div className="relative w-full h-[60vh] mb-60">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-black/30"></div> {/* Adds overlay */}
<div className="relative flex flex-col items-center justify-center text-center z-10 pt-4">
          <div className="w-80 h-80 rounded-full bg-white overflow-hidden shadow-md mx-auto mb-4">
            <img
              src="selfie.jpeg"
              alt="Your Headshot"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-6xl font-bold">Jonathen Whitford</h1>
          
          <p className="text-lg mt-2">
            Welcome! I'm a software engineer passionate about creating innovative and scalable web applications.
          </p>

{/* Embed Music */}
{/* Embed Music */}
<div className="mt-6 flex justify-center">
  <iframe
    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
    frameBorder="0"
    className="w-full sm:w-[800px] mt-22  mb-22 h-40 rounded-lg overflow-hidden"
    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
    src="https://embed.music.apple.com/us/album/dancing-in-the-moonlight/208819125?i=208819580"
  ></iframe>
</div>


        </div>
      </div>

      {/* Tab Navigation */}
      <div className="w-full max-w-7.5xl mx-auto p-6 mt-20 h-106">
      <div className="flex justify-center space-x-8 mb-6 border-b border-white overflow-x-auto">

      <button
            className={`py-2 px-4 ${
              activeTab === "welcome" ? "border-b-2 border-white text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("welcome")}
          >
            Welcome
          </button>
      <button
            className={`py-2 px-4 ${
              activeTab === "projects" ? "border-b-2 border-white text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "passion" ? "border-b-2 border-white text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("passion")}
          >
            Passion
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "employment" ? "border-b-2 border-white text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("employment")}
          >
            Employment
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "contact" ? "border-b-2 border-white text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 p-6 bg-black text-white rounded-xl relative overflow-hidden shadow-lg">
  {/* Glowing Border Effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-lg opacity-50"></div>
  <div className="absolute inset-0 border-4 border-transparent rounded-xl bg-clip-border bg-gradient-to-r from-purple-500 via-blue-500 to-green-600"></div>
  
  {/* Content */}
  {activeTab === "welcome" && (
  <div className="relative z-10 text-center p-6">
    <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-red-700 mb-9 animate-pulse">
      Welcome to My Portfolio
    </h2>
    <p className="text-xl leading-relaxed text-gray-300">
      Hi! I'm <span className="text-orange-400 font-bold">Jonathen</span>, a software engineer with a passion for creating 
      <span className="text-red-700 font-bold"> user-centric web applications.</span> 
      <br /><br />
      Explore the tabs to learn more about my projects, passion, and professional journey. I look forward to connecting with you!
    </p>

    {/* Social Media Links */}
    <div className="flex justify-center mt-6 space-x-6">
      <a
        href="https://github.com/YourGitHubUsername"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transform transition-transform"
      >
        <img
          src="/github.webp"
          alt="GitHub"
          className="w-20 h-20 rounded-full"
          />
      </a>
      <a
        href="https://linkedin.com/in/YourLinkedInUsername"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transform transition-transform"
      >
        <img
          src="/linkedin.webp"
          alt="LinkedIn"
          className="w-20 h-20 rounded-full"
          />
      </a>
      
    </div>
  </div>
)}


{activeTab === "projects" && (

<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
{/* Project Cards */}
              <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
  <div className="relative w-full h-52 overflow-hidden rounded-md">
    <img
      src="/gweather.png"
      alt="Gweather Screenshot"
      className="w-full h-62 object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-center text-sm px-2">
        An LGBTQIA+ website showcasing Provincetown, RI, built with HTML, CSS, and JavaScript.
      </p>
    </div>
  </div>
  <h3 className="text-xl font-semibold mt-4">Gweather</h3>
  <p className="mt-2 text-sm text-gray-600">HTML, CSS, JavaScript</p>
  <a
    href="https://achi11ean.github.io/phase1Project/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
  >
    Visit Site
  </a>
</div>

<div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
  <div className="relative w-full h-52 overflow-hidden rounded-md">
    <img
      src="/potterhub.png"
      alt="PotterHub Screenshot"
      className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-center text-sm px-2">
        A compendium of Harry Potter characters and spells built with React and Vite.
      </p>
    </div>
  </div>
  <h3 className="text-xl font-semibold mt-4">PotterHub</h3>
  <p className="mt-2 text-sm text-gray-600">React, Vite</p>
  <a
    href="https://main--potterpals.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
  >
    Visit Site
  </a>
</div>
<div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
  <div className="relative w-full h-52 overflow-hidden rounded-md">
    <img
      src="/matrix.jpeg"
      alt="CLI Event Planner Screenshot"
      className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-center text-sm px-2">
        A Python-based CLI tool for managing events and tours, designed to assist artists, venues, and attendees.
      </p>
    </div>
  </div>
  <h3 className="text-xl font-semibold mt-4">CLI Event Planner</h3>
  <p className="mt-2 text-sm text-gray-600">Python, CLI</p>
  <a
    href="https://github.com/Achi11ean/Final-Project"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
  >
    Visit Site
  </a>
</div>

<div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
  <div className="relative w-full h-52 overflow-hidden rounded-md">
    <img
      src="/Prismm.png"
      alt="PRISM Screenshot"
      className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-center text-sm px-2">
        A full-stack web application built with Flask and React, designed to manage events, tours, and attendees.
      </p>
    </div>
  </div>
  <h3 className="text-xl font-semibold mt-4">PRISM</h3>
  <p className="mt-2 text-sm text-gray-600">Flask, React</p>
  <a
    href="https://iridescent-prism.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
  >
    Visit Site
  </a>
</div>

            </div>
          )}
          
          {activeTab === "passion" && (
  <div className="relative p-6 text-white rounded-lg shadow overflow-hidden min-h-[500px]">
    {/* Fire Animation Background */}
    <div className="absolute inset-0 z-0 bg-gradient-to-r from-orange-500 via-red-600 to-yellow-500 animate-flicker"></div>
    <div className="absolute inset-0 h-200 z-10 opacity-50 bg-[url('/gif.webp')] bg-cover bg-center"></div>

    {/* Content */}
    <div className="relative z-20">
      <h2 className="text-3xl font-bold mb-4">My Passion for Technology</h2>
      <p className="text-2xl leading-relaxed">
        My passion for technology grew from experiences teaching clients about technology at the bank, troubleshooting their problems, and creating websites to help others. 
        <br /><br />
        These experiences revealed how technology could empower people, simplify their lives, and create meaningful connections. Teaching clients provided opportunities to break down complex systems into understandable solutions, building trust and making technology more accessible. 
        <br /><br />
        Troubleshooting challenges reinforced the satisfaction of solving problems and helping others navigate technical obstacles. Meanwhile, designing websites combined creativity with purpose, allowing for the creation of user-friendly platforms that simplify tasks and bring ideas to life.
        <br /><br />
        This combination of teaching, problem-solving, and creative development showed how technology can be a powerful tool for supporting, inspiring, and improving the lives of others, fostering a deep and lasting passion for the field.
      </p>
    </div>
  </div>
)}


{activeTab === "employment" && (
  <div className="relative p-6 text-white rounded-lg shadow overflow-hidden">
    {/* Background Animation */}
    <div className="absolute inset-0 z-0 bg-[url('/money.webp')] bg-cover bg-center opacity-70"></div>
    <div className="absolute inset-0 bg-black/50 z-5"></div>

    {/* Content */}
    <div className="relative z-10">
      <h4 className="font-semibold text-2xl mb-4">Webster Bank</h4>
      <p className="mt-2 text-lg leading-relaxed">
        <strong>Assistant Manager</strong> (Mar 2023 - Jun 2024):
        <ul className="list-disc list-inside mt-2">
          <li>Leadership and team development: Led a dynamic team of financial advisors, fostering a collaborative and positive work environment while mentoring staff to achieve their individual performance goals.</li>
          <li>Change management expertise: Played a critical role in the successful transition to new banking systems, troubleshooting issues, and minimizing disruptions.</li>
          <li>Advanced Client Advisory: Delivered exceptional financial advice, helping clients reach their goals through strategic product recommendations and referrals.</li>
        </ul>
      </p>

      <h4 className="font-semibold text-2xl mt-6">Bank of America</h4>
      <p className="mt-2 text-lg leading-relaxed">
        <strong>Home Services Specialist I</strong> (Mar 2022 - Mar 2023):
        <ul className="list-disc list-inside mt-2">
          <li>Expert applicant processor: Analyzed borrower income and legal documentation to ensure regulatory compliance.</li>
          <li>Advanced data integrity management: Validated financial data with precision, ensuring accuracy and completeness.</li>
          <li>Strategic client engagement: Guided clients through the loan process, providing expert guidance and resolving complex issues.</li>
        </ul>
      </p>

      <h4 className="font-semibold text-2xl mt-6">Relationship Banker</h4>
      <p className="mt-2 text-lg leading-relaxed">
        <strong>Wethersfield, Connecticut</strong> (Oct 2018 - Mar 2022):
        <ul className="list-disc list-inside mt-2">
          <li>Client-centered financial strategy: Provided tailored financial solutions, including credit cards, home loans, and savings accounts.</li>
          <li>Comprehensive product knowledge: Advised clients on an extensive portfolio of financial products.</li>
          <li>Investment referral excellence: Referred high-net-worth clients to specialists for advanced financial strategies.</li>
        </ul>
      </p>

      <h4 className="font-semibold text-2xl mt-6">Risk Analyst – PPP Loan Processing</h4>
      <p className="mt-2 text-lg leading-relaxed">
        <strong>Full-time, WFH</strong> (2020 - Mar 2020):
        <ul className="list-disc list-inside mt-2">
          <li>Reviewed income and tax documents for PPP loan eligibility, ensuring compliance.</li>
          <li>Worked overnight shifts, earning commendations for exceptional accuracy and dedication in a fast-paced environment.</li>
        </ul>
      </p>
    </div>
  </div>
)}


{activeTab === "contact" && (
  <div className="relative p-6 text-white rounded-lg shadow overflow-hidden">
    {/* Background Animation */}
    <div className="absolute inset-0 z-0 bg-[url('/beach.webp')] bg-cover bg-center opacity-50"></div>

    {/* Content */}
    <div className="relative z-10 p-6 bg-black/50 rounded-lg">
      <ContactForm />
      
      {/* Get in Touch Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setShowContactInfo(!showContactInfo)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-transform"
        >
          {showContactInfo ? "Hide Contact Info" : "Get in Touch"}
        </button>
        {showContactInfo && (
          <div className="mt-4 text-lg">
            <p className="text-gray-200">Phone: <span className="text-white font-bold">(959) 204-1689</span></p>
            <p className="text-gray-200">Email: <span className="text-white font-bold">paredes.jonathen@yahoo.com</span></p>
          </div>
        )}
      </div>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
