import { useState, useEffect,useRef } from "react";
import AnimatedBackground from "./AnimatedBackground";
import ContactForm from "./ContactForm";
import PerformanceForm from "./PerformanceForm";
import EngineeringForm from "./EngineeringForm";
import EducationSkills from "./EducationSkills";
import Reviews from "./Reviews";
import Signin from "./Signin";
import Admin from "./Admin";
import { useAuth } from "./AuthContext";
import Gallery from "./Gallery"; // Import the Gallery component
import Snowfall from "./Snowfall";
import CalendarComponent from "./Calendar";
import Karaoke from "./KaraokeSignUp"; // Add this import
import Navbar from "./Navbar";

import "./App.css"
export default function App() {
  const [activeTab, setActiveTab] = useState("welcome"); 
  const [collapsed, setCollapsed] = useState(false);
  const scrollContainerRef = useRef(null);

  const { token, logout, user } = useAuth();
  const [showEmojis, setShowEmojis] = useState(false);
  const triggerEmojis = () => {
    setShowEmojis(true);
    setTimeout(() => setShowEmojis(false), 3000); 
  };
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [showPerformanceForm, setShowPerformanceForm] = useState(false); // State for toggling Performance Booking Form
  const [showEngineeringForm, setShowEngineeringForm] = useState(false); // State for Engineering Booking Form
  const [showEducationSkills, setShowEducationSkills] = useState(false); // State to toggle EducationSkills visibility
  const [selectedVideo, setSelectedVideo] = useState(""); // State for selected video
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
useEffect(() => {
  const scrollContainer = scrollContainerRef.current;
  if (!scrollContainer) return;

  let scrollAmount = 0;
  const scrollStep = 1;
  const scrollInterval = 50;

  const autoScroll = setInterval(() => {
    if (scrollContainer) {
      scrollContainer.scrollTop += scrollStep;
      scrollAmount += scrollStep;

      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
        scrollContainer.scrollTop = 0;
        scrollAmount = 0;
      }
    }
  }, scrollInterval);

  return () => clearInterval(autoScroll);
}, []);
  const [openSection, setOpenSection] = useState(null); // State for open dropdown
  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };
  // Load Instagram script once globally
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    return () => {
      document.body.removeChild(script); // Clean up script
    };
  }, []);

  // Reprocess Instagram embeds when the video changes
  useEffect(() => {
    if (window.instgrm && selectedVideo.startsWith("instagram")) {
      window.instgrm.Embeds.process();
    }
  }, [selectedVideo]);

  return (
<div
  className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white overflow-auto"
  style={{
    backgroundImage: "url('https://wallpapers.com/images/hd/valentines-day-desktop-4fa80xzglfmkmt7m.jpg')",
    backgroundPosition: "center  top 450px", // Adjust the vertical position
  }}
>

      <div className="absolute inset-0 bg-gray-600 opacity-50 pointer-events-none"></div>
      <div className="relative w-full pb-20">
        {" "}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} token={token} logout={logout} />
        <AnimatedBackground />
        {/* <Snowfall /> */}
        <div className="absolute inset-0 bg-black/30"></div>{" "}
        {/* Adds overlay */}
        <div className="relative flex flex-col items-center justify-center text-center z-10 pt-4 px-4 sm:px-8">
          <div className="  mt-20 sm:mt-0 sm:h-80  bg-white overflow-hidden shadow-md mx-auto mb-4 ">
            <img
              src="https://i.imgur.com/IEeLPPL.jpeg"
              alt="Your Headshot"
              className="w-full  h-full object-cover"
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold">
  <span className="font-aspire font-bold pl-4 text-transparent bg-clip-text 
    bg-gradient-to-r from-red-500 via-yellow-500   to-purple-500 
    italic animate-glow">
    JWhit
  </span> 
  <br/>
  <span className="text-red-600 rounded font-serif animate-pulse  p-1 tracking-wide">
    Productions
  </span>
</h1>



          <p className="text-sm sm:text-3xl mt-2 max-w-lg font-aspire">
            By Jonathen Whitford
          </p>

          {/* <div className="mt-6 flex justify-center">
            <a
              href="https://www.connecticuttheatrecompany.org/box-office/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-2xl sm:px-6 sm:py-3 sm:text-2xl lg:text-3xl font-extrabold text-white bg-gradient-to-r from-red-600 to-green-500 border-2 border-red-400 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-red-600 hover:shadow-2xl"
              style={{
                fontFamily: "'Aspire', serif",
                textShadow: "0 0 8px #fff, 0 0 12px #ff0000, 0 0 16px #00ff00",
              }}
            >
              🎟️ Buy Tickets to{" "}
              <span className="mx-1 text-black">A Christmas Carol</span>{" "}
              Now! 🎄
            </a>
          </div> */}



          <div className="mt-6 flex justify-center w-full">
            <iframe
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              frameBorder="0"
              className="w-full max-w-xs sm:max-w-2xl h-24 sm:h-60 rounded-lg overflow-hidden"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src="https://embed.music.apple.com/us/playlist/favorite-songs/pl.u-m6UB7NWme"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="relative mb-2 w-full h-1  bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 shadow-lg overflow-hidden">
  <div className="absolute inset-0 w-full h-full animate-flashy-sparkle"></div>
</div>
      <button
  className="block  sm:block md:block lg:hidden xl:hidden 2xl:hidden
             bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 
             hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 
             text-white font-bold py-3 w-full animate-none rounded-lg shadow-lg transition-all transform hover:scale-105"
  onClick={() => setActiveTab("karaoke")}
>
  🎤 Karaoke Sign up Sheet  📝
</button>




      <div className="w-full  max-w-7.5xl mx-auto p-6">



        {/* Tab Content */}
        <div className="mt-4 p-6 justify-center items-center text-white rounded-xl relative overflow-hidden shadow-lg">
          {showEmojis && (
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
              {Array.from({ length: 20 }).map((_, index) => (
                <span
                  key={index}
                  className="emoji"
                  style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 1}s`,
                  }}
                >
                  {Math.random() > 0.5 ? "🌟" : "💕"}
                </span>
              ))}
            </div>
          )}

          {activeTab === "admin-signin" && (
            <Signin setActiveTab={setActiveTab} />
          )}
          {activeTab === "admin-dashboard" && <Admin />}
          {activeTab === "gallery" && <Gallery />}
          {activeTab === "karaoke" && <Karaoke />}

          {activeTab === "businessweekly" && (
  <div className="flex flex-col items-center bg-orange-500 rounded-3xl justify-center min-h-[50vh]">
    <p className="text-2xl sm:text-xl font-semibold mt-4 text-green-800 font-mono">
    🚧 CTRL+ ALT+ Innovate 🚧 
</p>

    <img 
      src="https://t4.ftcdn.net/jpg/02/04/71/07/360_F_204710733_326ouzzcjAKx9mJaNrwjQEUqXJOH1Kgu.jpg" // Replace with the actual path to your image
      alt="Coming Soon"
      className="object-contain rounded-2xl  mt-10"
    />

<div className="max-w-45l">
<p className="text-xl text-center font-semibold text-white  pr-6 mt-4">
  🚀 Weekly AI-Powered Business Insights 🚀  
  <br/><br/>
  Get ahead of the curve with the latest tech trends designed to elevate your small business in the era of AI!  

</p>
<p className="text-xl text-center mb-7 font-semibold text-white mt-6">
  ✨ Stay tuned for actionable insights to help your business grow, operate faster, and stay ahead of the competition!   
  <br/><br/>
  🌟 Discover how AI is transforming: 
</p>

<ul className="text-lg text-center text-white mt-4 space-y-2">
  <li>🛍️ Retail & E-commerce: Local shops, online stores, thrift boutiques</li>
  <li>🏠 Home & Trade Services: Electricians, roofers, plumbers, HVAC, landscapers</li>
  <li>💼 Professional Services: Marketing agencies, financial consultants, IT support</li>
  <li>🏥 Health & Wellness: Healthcare providers, personal trainers, yoga studios</li>
  <li>🚗 Automotive & Transportation: Auto repair, mobile mechanics, taxis, towing</li>
  <li>🍽️ Food & Hospitality: Restaurants, cafés, food trucks, catering</li>
  <li>🎨 Creative & Media: Photographers, content creators, musicians</li>
  <li>📚 Education & Coaching: Tutors, online course creators, music teachers</li>
  <li>🏠 Real Estate Agents & Brokers – Residential & commercial property sales</li>
  <li>🏢 Property Management Companies – Rental management, tenant screening, maintenance</li>
  <li>🏡 Real Estate Investors & House Flippers – Buying, renovating, and selling properties</li>
  <li>🏘 Short-Term Rental Hosts – Airbnb, VRBO, vacation rental managers</li>
</ul>
<p className="text-2xl underline text-center mb-7 font-semibold text-white mt-6">✨⬇️Vote Below on what topic you'd like to see us unveil first!⬇️✨</p>

</div>
<div
  className="strawpoll-embed"
  id="strawpoll_XOgOVd7jbn3"
  style={{ height: "779px", maxWidth: "640px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", paddingBottom:"15px"}}
>
  <iframe
    title="StrawPoll Embed"
    id="strawpoll_iframe_XOgOVd7jbn3"
    src="https://strawpoll.com/embed/XOgOVd7jbn3"
    style={{ position: "static", visibility: "visible", display: "block", width: "100%", flexGrow: 1 }}
    frameBorder="0"
    allowFullScreen
    allowTransparency="true"
  >
    Loading...
  </iframe>
  <script async src="https://cdn.strawpoll.com/dist/widgets.js" charSet="utf-8"></script>
</div>

  </div>
)}

          {/* Glowing Border Effect */}

          {/* Content */}
          {activeTab === "welcome" && (
  <div className="relative z-10  rounded-3xl bg-gray-700 text-center p-6">
    
    {/* Social Media Links */}
    <div className="flex justify-center mt-6 space-x-6">
      <a
        href="https://github.com/Achi11ean"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transform transition-transform"
      >
        <img src="/github.webp" alt="GitHub" className="w-20 h-20 rounded-full" />
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/jonathen-whitford/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transform transition-transform"
      >
        <img src="/linkedin.webp" alt="LinkedIn" className="w-20 h-20 rounded-full" />
        LinkedIn
      </a>
      <a
        href="https://1drv.ms/w/c/5752b0b995ca8e1e/EWuCsvWBBr1HosYQAxQwp7YBL83c-7iSUww3Vb0Iu8d4Vg"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transform transition-transform"
      >
        <img src="resume.webp" alt="Resume" className="w-20 h-20 rounded-full" />
        Resume
      </a>
    </div>

    {/* Toggle Button */}
    <div className="text-center mt-6">
      <button
        onClick={() => setShowEducationSkills(!showEducationSkills)}
        className="py-2 px-6 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg shadow-lg transition-all"
      >
        {showEducationSkills ? "Hide Education and Skills" : "Show Education and Skills"}
      </button>
      {showEducationSkills && <EducationSkills />}
    </div>

    {/* Auto-Scrolling Section */}
    <div
      ref={scrollContainerRef}
      className="max-h-96 mb-10 mt-2 overflow-y-auto p-6 bg-gray-900 bg-opacity-80 rounded-2xl shadow-lg border border-gray-700 text-white text-center leading-relaxed"
    >
      <p className="text-lg mb-16 pt-3 sm:text-2xl md:text-3xl font-bold">
        I'm <span className="text-white font-bold">Jonathen</span>, a software engineer and passionate{" "}
        <span className="text-pink-800 font-bold">Karaoke Host</span> who thrives on building{" "}
        <span className="text-red-300 font-bold">user-centric web applications</span> and creating{" "}
        <span className="text-pink-300 font-bold">unforgettable entertainment experiences.</span>
        <br /><br />

        By day, I develop high-performance web solutions, and by night, I host unforgettable Karaoke experiences. 🎤✨  
        Singers can sign up through the <button className="text-yellow-400 font-bold underline hover:text-yellow-500 transition"
          onClick={() => setActiveTab("karaoke")}>Karaoke Signup</button> tab to get their moment on stage!
        <br /><br />

        Curious about my engineering work? Dive into <button className="text-green-400 font-bold underline hover:text-green-500 transition"
          onClick={() => setActiveTab("education")}>Jwhit©️</button>, where I showcase my latest software and AI-driven innovations.
        <br /><br />

        Want to explore my career journey? Check out my <button className="text-blue-300 font-bold underline hover:text-blue-400 transition"
          onClick={() => setActiveTab("employment")}>Employment History</button>, where I detail my experience in software engineering and technology.
        <br /><br />

        I’m also deeply passionate about the impact of AI across industries. My upcoming <button className="text-red-400 font-bold underline hover:text-red-500 transition"
          onClick={() => setActiveTab("businessweekly")}>Inc & AI</button> tab will cover the effects of AI in various industries—stay tuned!
        <br /><br />

        Want to see what others are saying? Head over to the <button className="text-purple-400 font-bold underline hover:text-purple-500 transition"
          onClick={() => setActiveTab("reviews")}>Reviews</button> tab to hear from those I’ve worked with, whether it’s software clients or Karaoke guests!
        <br /><br />

        If you’d like to book me for a private event, visit the <button className="text-pink-800 font-bold underline hover:text-pink-900 transition"
          onClick={() => setActiveTab("basic-services")}>Services</button> tab and lock in an unforgettable night of entertainment!
        <br /><br />

        Want to check out my work in action? Browse through my <button className="text-yellow-500 font-bold underline hover:text-yellow-600 transition"
          onClick={() => setActiveTab("gallery")}>Gallery</button> for event highlights and coding projects.
        <br /><br />

        Have a question or want to collaborate? Reach out through the <button className="text-cyan-400 font-bold underline hover:text-cyan-500 transition"
          onClick={() => setActiveTab("contact")}>Contact</button> tab—I’d love to hear from you!
        <br /><br />

        This website was built using{" "}
        <span className="text-blue-600 font-bold">React</span> and{" "}
        <span className="text-green-300 font-bold">Vite</span> for fast development, styled with{" "}
        <span className="text-teal-200 font-bold">Tailwind CSS</span> for a modern and responsive design, and powered by <span className="text-purple-300 font-bold">Stripe</span> for seamless booking and payment functionality.
        This site also features dynamic graphs 📊, embedded real-time analytics, and an interactive experience powered by Python-based data processing.

      </p>
    </div>
  </div>
)} {/* ✅ Closing Parentheses Here */}


          {activeTab === "education" && (
            <div className="space-y-8">
              {/* Education and Skills Section */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg"></div>

              {/* Project Cards */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">


              <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
  <div className="relative w-full h-52 overflow-hidden rounded-md">
    {/* Placeholder for the image */}
    <img
      src="abofacs.png" // Replace this with your actual image
      alt="A Breath of Fresh Air Cleaning Services"
      className="w-full h-full object-cover object-top  rounded-md transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <p className="text-center text-sm px-2">
  A fully operational cleaning service based in Connecticut, dedicated to excellence and customer satisfaction. Collaborating with the owner, Amanda, was an absolute pleasure—her vision and commitment to quality made this project both insightful and rewarding. Book her services now here!  <br/>(This is a LIVE CLIENT SITE)
</p>

    </div>
  </div>
  <h3 className="text-xl text-gray-600 font-semibold mt-4">
    A Breath of Fresh Air Cleaning Services
  </h3>
  <p className="mt-2 text-sm text-gray-600">
    Python, Flask, React, Vite, Tailwind CSS, Headless CMS, and SEO best practices.
  </p>
  <a
    href="https://abofacs.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white"
    >
    Visit Site
  </a>
</div>



              <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
  <div className="relative w-full h-52 overflow-hidden rounded-md">
    <img
      src="https://i.imgur.com/UjDeUSH.jpeg"
      alt="Golden Hour Photography Screenshot"
      className="w-full h-full object-cover object-top rounded-md transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-center text-sm px-2">
        A stunning photography portfolio showcasing artistic talent and 
        professional offerings, designed with a focus on aesthetics and user 
        experience. <br/>(This is a template for a possible website - not a live client site)
      </p>
    </div>
  </div>
  <h3 className="text-xl text-gray-600 font-semibold mt-4">
    Amara's PhotoHut
  </h3>
  <p className="mt-2 text-sm text-gray-600">
    React, Vite, Tailwind CSS
  </p>
  <a
    href="https://jwhitproductionsphotography.netlify.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white"
  >
    Visit Site
  </a>
</div>

                {/* Ink Haven by Jwhit Productions */}
                <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
                  
                  <div className="relative w-full h-52 overflow-hidden rounded-md">
                    <img
                      src="InkHaven.png" // Replace with the actual image path for Ink Haven
                      alt="Ink Haven Screenshot"
                      className="w-full h-full object-cover object-top rounded-md transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-center text-sm px-2">
                        A tattoo parlor booking website built with React, Vite,
                        and Tailwind CSS, offering a modern and responsive user
                        experience. <br/>(This is a template for a possible website - not a live client site)
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-600 font-semibold mt-4">
                    Ink Haven
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    React, Vite, Tailwind CSS
                  </p>
                  <a
                    href="https://jwhitproductionstattooparlor.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white"
                    >
                    Visit Site
                  </a>
                </div>

                <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
                  <div className="relative w-full h-52 overflow-hidden rounded-md">
                    <img
                      src="/gweather.png"
                      alt="Gweather Screenshot"
                      className="w-full h-62 object-cover object-top rounded-md transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-center text-sm px-2">
                        An LGBTQIA+ website showcasing Provincetown, RI, built
                        with HTML, CSS, and JavaScript.
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-600 font-semibold mt-4">
                    Gweather
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    HTML, CSS, JavaScript
                  </p>
                  <a
                    href="https://achi11ean.github.io/phase1Project/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white"
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
                        A compendium of Harry Potter characters and spells built
                        with React and Vite.
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-600 font-semibold mt-4">
                    PotterHub
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">React, Vite</p>
                  <a
                    href="https://main--potterpals.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white"
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
                        A Python-based CLI tool for managing events and tours,
                        designed to assist artists, venues, and attendees.
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-600 font-semibold mt-4">
                    CLI Event Planner
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">Python, CLI</p>
                  <a
                    href="https://github.com/Achi11ean/Final-Project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white"
                    >
                    Visit Site
                  </a>
                </div>

                <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center relative group">
                  <div className="relative w-full h-52 overflow-hidden rounded-md">
                    <img
                      src="/Prismm.png"
                      alt="PRISM Screenshot"
                      className="w-full h-full object-cover object-top rounded-md transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-center text-sm px-2">
                        A full-stack web application built with Flask and React,
                        designed to manage events, tours, and attendees.
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl text-gray-600 font-semibold mt-4">
                    PRISM
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">Flask, React</p>
                  <a
                    href="https://iridescent-prism.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:text-white"
                    >
                    Visit Site
                  </a>
                </div>
              </div>
            </div>
          )}
          {activeTab === "reviews" && <Reviews triggerEmojis={triggerEmojis} />}

          {activeTab === "passion" && (
            <div className="space-y-6">
              {/* Dropdown for Passion for Performing */}
              <div>
              <button
  className="w-full text-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white py-4 px-6 text-2xl font-bold rounded-lg shadow-2xl transform transition-all duration-300 relative overflow-hidden hover:scale-110 hover:shadow-pink-400/50"
  onClick={() => toggleSection("performing")}
>
  {/* Roaming Spotlight Circles */}
  <span className="absolute inset-0">
    <span className="absolute w-48 h-48 bg-white rounded-full blur-3xl animate-roam-1"></span>
    <span className="absolute w-48 h-48 bg-white rounded-full blur-2xl animate-roam-2"></span>
  </span>

  {/* Button Text */}
  <span className="relative z-10 inline-block tracking-wide uppercase font-mono">
    🎭 Performing Arts 🎶
  </span>
</button>


                {openSection === "performing" && (
                  <div className="relative p-6 text-white rounded-lg shadow-lg overflow-hidden min-h-[600px]">
                    {/* Background for Performing */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-pink-500 via-purple-600 to-red-500 opacity-50"></div>

                    {/* Content */}
                    <div className="relative text-center z-20 space-y-6">
                      <h2 className="text-5xl font-extrabold mb-6">
                        My Passion for The Arts
                      </h2>
                      <p className="text-2xl leading-relaxed mb-6">
                        Performing has always been a cornerstone of my life, and
                        music is one of my greatest passions.
                      </p>
                      <p className="text-2xl">
                        Some Wonderful experiences i've had performing include:
                      </p>
                      <ul className="list-disc list-inside text-2xl mt-2 mb-4">
                        <li>
                          Performing at weddings and local LGBTQ+ events with
                          Sky Casper Entertainment.
                        </li>
                        <li>
                          Hosting karaoke for two years, creating a space for
                          others to share in the joy of music.
                        </li>
                        <li>
                          Embarking on an exciting journey to create my own
                          music, pouring my heart into every lyric and melody.
                        </li>
                      </ul>

                      <p className="text-xl leading-relaxed">
                        One of the most thrilling experiences was my role in{" "}
                        <em>Cabaret the Musical</em>, where I played the
                        characters of Herman, Max, and Sailor. <br />
                        This is our last weekend performing{" "}
                        <em>A Christmas Carol</em>, where I play Fred—the{" "}
                        <em>wonderfully British</em> nephew of dear old Uncle
                        Scrooge. <br />
                        Tickets are available at the link below. Don’t miss out
                        on this festive experience! <br />
                        Up next, I’m excited to be featured on an up-and-coming
                        artist’s album and to start more work on my own music.
                        Stay tuned for what’s to come!
                      </p>

                      {/* Ticket Link Dropdown */}
                      <div className="mt-6">
                        <select
                          className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 py-3 px-4 rounded-xl shadow-lg text-white font-extrabold text-xl text-center tracking-wide hover:scale-105 transform transition-transform duration-300 hover:bg-gradient-to-r hover:from-pink-600 hover:via-purple-700 hover:to-yellow-500 focus:ring-4 focus:ring-purple-600 focus:outline-none"
                          onChange={(e) => {
                            if (e.target.value) {
                              window.open(e.target.value, "_blank");
                            }
                          }}
                        >
                          <option value="">Tickets on sale Now!</option>
                          <option value="https://www.connecticuttheatrecompany.org/box-office/">
                            Tickets for A Christmas Carol December 2024
                          </option>
                          {/* Add more performance options as needed */}
                        </select>
                        <p className="mt-3">
                          Select A Song to Watch me Perform it in the video
                          below!
                        </p>
                      </div>

                      {/* Video Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {/* Cabaret Musical Performance */}
                        <div
                          className="bg-black text-center shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() =>
                            setSelectedVideo(
                              "https://player.vimeo.com/video/1031800524"
                            )
                          }
                        >
<h3
  className="bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 
  text-transparent bg-clip-text shadow-lg rounded-2xl p-3 sm:p-4 md:p-6 
  cursor-pointer hover:scale-105 hover:shadow-red-700 
  transform transition-transform duration-300 
  text-sm sm:text-base md:text-lg lg:text-2xl font-extrabold tracking-wider uppercase"
>
  Cabaret Musical Performance
</h3>

                        </div>

                        {/* Beautiful Things - Benson Boone */}
                        <div
                          className="bg-black text-center shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedVideo("instagram3")}
                        >
<h3
  className="bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 
  text-transparent bg-clip-text shadow-lg rounded-2xl p-3 sm:p-4 md:p-6 
  cursor-pointer hover:scale-105 hover:shadow-orange-700 
  transform transition-transform duration-300 
  text-sm sm:text-base md:text-lg lg:text-2xl font-extrabold tracking-wider uppercase"
>
  Beautiful Things - Benson Boone
</h3>

                        </div>

                        {/* You - Miley Cyrus */}
                        <div
                          className="bg-black text-center shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedVideo("instagram2")}
                        >
<h3
  className="bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 
  text-transparent bg-clip-text shadow-lg rounded-2xl p-3 sm:p-4 md:p-6 
  cursor-pointer hover:scale-105 hover:shadow-yellow-700 
  transform transition-transform duration-300 
  text-sm sm:text-base md:text-lg lg:text-2xl font-extrabold tracking-wider uppercase"
>
  You - Miley Cyrus
</h3>

                        </div>

                        {/* Somebody - Jelly Roll */}
                        <div
                          className="bg-black text-center shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedVideo("instagram1")}
                        >
                          <h3   className="bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 
  text-transparent bg-clip-text shadow-lg rounded-2xl p-3 sm:p-4 md:p-6 
  cursor-pointer hover:scale-105 hover:shadow-yellow-700 
  transform transition-transform duration-300 
  text-sm sm:text-base md:text-lg lg:text-2xl font-extrabold tracking-wider uppercase">
                            Somebody - Jelly Roll
                          </h3>
                        </div>

                        {/* Haunted House - Christina Aguilera */}
                        <div
                          className="bg-black text-center shadow-lg rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedVideo("instagram4")}
                        >
                          <h3   className="bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 
  text-transparent bg-clip-text shadow-lg rounded-2xl p-3 sm:p-4 md:p-6 
  cursor-pointer hover:scale-105 hover:shadow-yellow-700 
  transform transition-transform duration-300 
  text-sm sm:text-base md:text-lg lg:text-2xl font-extrabold tracking-wider uppercase">
                            Haunted House - Christina Aguilera
                          </h3>
                        </div>

                        {/* New Video - Beautiful Symphony */}
                        <div
                          className="bg-black text-center  rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedVideo("instagram5")}
                        >
                          <h3   className="bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-400 
  text-transparent bg-clip-text shadow-lg rounded-2xl p-3 sm:p-4 md:p-6 
  cursor-pointer hover:scale-105 hover:shadow-yellow-700 
  transform transition-transform duration-300 
  text-sm sm:text-base md:text-lg lg:text-2xl font-extrabold tracking-wider uppercase">
                            Too Sweet - Hozier
                          </h3>
                        </div>
                      </div>

                      {/* Video Player */}
                      <div className="flex items-center justify-center h-[300px] rounded-2xl overflow-hidden mt-6">
                        {selectedVideo.startsWith("instagram") ? (
                          <div
                            key={selectedVideo}
                            className="instagram-container"
                          >
                            {/* Instagram Embed Block */}
                            <blockquote
                              className="instagram-media"
                              data-instgrm-permalink={
                                selectedVideo === "instagram1"
                                  ? "https://www.instagram.com/reel/DC4J0fERW6E/?utm_source=ig_embed&amp;utm_campaign=loading"
                                  : selectedVideo === "instagram2"
                                  ? "https://www.instagram.com/reel/DC4MaLdxfUB/?utm_source=ig_embed&amp;utm_campaign=loading"
                                  : selectedVideo === "instagram3"
                                  ? "https://www.instagram.com/reel/DC4NOC2Rsoi/?utm_source=ig_embed&amp;utm_campaign=loading"
                                  : selectedVideo === "instagram4"
                                  ? "https://www.instagram.com/reel/DAzJtSxOhE9/?utm_source=ig_embed&amp;utm_campaign=loading"
                                  : "https://www.instagram.com/reel/C_q_mZ9O6Ag/?utm_source=ig_embed&amp;utm_campaign=loading" // Instagram5 - Beautiful Symphony
                              }
                              data-instgrm-version="14"
                              style={{
                                background: "#FFF",
                                border: "0",
                                borderRadius: "3px",
                                boxShadow:
                                  "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                                margin: "1px",
                                maxWidth: "540px",
                                minWidth: "326px",
                                padding: "0",
                                width: "calc(100% - 2px)",
                              }}
                            >
                              <a
                                href={
                                  selectedVideo === "instagram1"
                                    ? "https://www.instagram.com/reel/DC4J0fERW6E/?utm_source=ig_embed&amp;utm_campaign=loading"
                                    : selectedVideo === "instagram2"
                                    ? "https://www.instagram.com/reel/DC4MaLdxfUB/?utm_source=ig_embed&amp;utm_campaign=loading"
                                    : selectedVideo === "instagram3"
                                    ? "https://www.instagram.com/reel/DC4NOC2Rsoi/?utm_source=ig_embed&amp;utm_campaign=loading"
                                    : selectedVideo === "instagram4"
                                    ? "https://www.instagram.com/reel/DAzJtSxOhE9/?utm_source=ig_embed&amp;utm_campaign=loading"
                                    : "https://www.instagram.com/reel/C_q_mZ9O6Ag/?utm_source=ig_embed&amp;utm_campaign=loading" // Instagram5 - Beautiful Symphony
                                }
                                target="_blank"
                                style={{
                                  background: "#FFF",
                                  lineHeight: "0",
                                  padding: "0",
                                  textAlign: "center",
                                  textDecoration: "none",
                                  width: "100%",
                                }}
                              >
                                View this post on Instagram
                              </a>
                            </blockquote>
                          </div>
                        ) : selectedVideo ? (
                          // Regular Video Embed (e.g., Vimeo)

                          <iframe
                            src={selectedVideo}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="w-full max-w-[800px] h-full rounded-2xl"
                          ></iframe>
                        ) : (
                          // Placeholder Text
                          <p className="text-lg text-gray-300">
                            Please select a video to watch by clicking a card
                            above.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown for Passion for Software Engineering */}
              <div>
              <button
  className="w-full text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 px-6 text-2xl mb-3 rounded-lg shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-blue-400/50 relative"
  onClick={() => toggleSection("technology")}
>
  {/* Mobile Text */}
  <span
    className="block sm:hidden font-mono tracking-widest text-lg animate-typing overflow-hidden whitespace-nowrap border-r-2 border-white"
  >
    {"< Developer />"}
  </span>

  {/* Larger Screen Text */}
  <span
    className="hidden sm:inline-block font-mono tracking-widest w-[17ch] animate-typing overflow-hidden whitespace-nowrap border-r-2 border-white"
  >
    {"< Software Engineering />"}
  </span>
</button>



                {openSection === "technology" && (
                  <div className="relative p-6 text-white rounded-lg shadow overflow-hidden min-h-[500px]">
                    {/* Fire Animation Background */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-orange-500 via-red-600 to-yellow-500 animate-flicker"></div>
                    <div className="absolute inset-0 h-200 z-10 opacity-50 bg-[url('/gif.webp')] bg-cover bg-center"></div>

                    {/* Content */}
                    <div className="relative z-20">
                      <h2 className="text-3xl font-bold mb-4">
                        Software Engineering
                      </h2>
                      <p className="text-2xl leading-relaxed">
                        My passion for technology grew from experiences teaching
                        clients about technology at the bank, troubleshooting
                        their problems, and creating websites to help others.
                        <br />
                        <br />
                        These experiences revealed how technology could empower
                        people, simplify their lives, and create meaningful
                        connections. Teaching clients provided opportunities to
                        break down complex systems into understandable
                        solutions, building trust and making technology more
                        accessible.
                        <br />
                        <br />
                        Troubleshooting challenges reinforced the satisfaction
                        of solving problems and helping others navigate
                        technical obstacles. Meanwhile, designing websites
                        combined creativity with purpose, allowing for the
                        creation of user-friendly platforms that simplify tasks
                        and bring ideas to life.
                        <br />
                        <br />
                        This combination of teaching, problem-solving, and
                        creative development showed how technology can be a
                        powerful tool for supporting, inspiring, and improving
                        the lives of others, fostering a deep and lasting
                        passion for the field.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

{activeTab === "employment" && (
  <div className="relative p-6 text-white rounded-lg shadow-lg overflow-hidden text-center">
    {/* Background Animation */}
    <div className="absolute inset-0 z-0 bg-[url('/money.webp')] bg-cover bg-center opacity-60"></div>
    <div className="absolute inset-0 bg-black/50 z-5"></div>

    {/* Content */}
    <div className="relative z-10 space-y-8">
<div className="items-center justify-center flex">      <a
        href="https://1drv.ms/w/c/5752b0b995ca8e1e/EWuCsvWBBr1HosYQAxQwp7YBL83c-7iSUww3Vb0Iu8d4Vg"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transform transition-transform"
      >
        <img src="resume.webp" alt="Resume" className="w-20 h-20 rounded-full" />
        Resume
      </a>      
      
      </div><div className="items-center justify-center flex">  
      
      <p className="bg-black  w-fit text-center">Be Advised: <br/> Dates may overlap due to working multiple jobs at the same time.</p>
</div>
      {/* 🔥 Current Role */}
      <h4 className="text-3xl font-extrabold text-yellow-400">Jwhit Productions</h4>
      <p className="text-lg">
        <span className="text-pink-400 font-bold">Founder & Full Stack Software Engineer | Karaoke Host</span>  
        <br />
        <span className="text-gray-300 italic">📅 Jun 2024 - Present</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>🎤 Launched <span className="font-bold text-blue-400">Jwhit Productions</span>, blending custom software engineering and karaoke entertainment.</li>
        <li>💻 Built full-stack web applications for clients, utilizing modern tech stacks.</li>
        <li>🎶 Hosted high-energy karaoke nights, earning rave client reviews.</li>
      </ul>

      {/* 🌟 Webster Bank */}
      <h4 className="text-3xl font-extrabold text-yellow-400">Webster Bank</h4>
      <p className="text-lg">
        <span className="text-pink-400 font-bold">Assistant Manager</span>  
        <br />
        <span className="text-gray-300 italic">📅 Mar 2023 - Jun 2024</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>🛠 Led a team of financial advisors, fostering collaboration and training.</li>
        <li>🔄 Managed a major banking system transition, ensuring seamless implementation.</li>
        <li>📊 Provided strategic financial advice to individuals and businesses.</li>
      </ul>

      {/* 🏡 Bank of America */}
      <h4 className="text-3xl font-extrabold text-yellow-400">Bank of America</h4>
      <p className="text-lg">
        <span className="text-pink-400 font-bold">Home Services Specialist I</span>  
        <br />
        <span className="text-gray-300 italic">📅 Mar 2022 - Mar 2023</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>📄 Processed loan applications, ensuring regulatory compliance.</li>
        <li>✅ Maintained high data integrity, reducing errors and improving efficiency.</li>
        <li>🤝 Acted as a trusted advisor, guiding clients through complex loans.</li>
      </ul>



      {/* 📊 Risk Analysis */}
      <h4 className="text-3xl font-extrabold text-yellow-400"> <br/> Bank of America</h4>
      <p className="text-lg">
        <span className="text-pink-400 font-bold">Remote Role <br/>Risk Analyst – PPP loan processing</span>  
        <br />
        <span className="text-gray-300 italic">📅 2020 - Mar 2020</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>📑 Reviewed PPP loan applications, assessing eligibility based on tax, state and insurance documents.</li>
        <li>🌙 Worked overnight shifts, earning commendations for accuracy & efficiency.</li>
      </ul>

      {/* 🛒 Retail & Management Experience */}


      <p className="text-lg">
        <span className="text-pink-400 font-bold">Relationship Banker</span>  
        <br />
        <span className="text-gray-300 italic">📅 Oct 2018 - Mar 2022</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>💳 Delivered custom financial solutions including credit & loan products.</li>
        <li>🏢 Assisted business clients with banking solutions for growth.</li>
        <li>💰 Referred high-net-worth clients to wealth management specialists.</li>
      </ul>


      {/* 🏦 JPMorgan Chase */}
      <h4 className="text-3xl font-extrabold text-yellow-400">JPMorgan Chase & Co.</h4>
      <p className="text-lg">
        <span className="text-pink-400 font-bold">Bank Teller</span>  
        <br />
        <span className="text-gray-300 italic">📅 Jul 2017 - Jul 2018</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>🏦 Managed $175K+ in cash transactions, ensuring accuracy & security.</li>
        <li>💬 Provided personalized financial solutions to customers.</li>
        <li>📍 ATM custodianship, ensuring functionality & security.</li>
      </ul>


      {/*  Winn Dixie */}
      <p className="text-lg">
      <h4 className="text-3xl font-extrabold text-yellow-400">Winn Dixie</h4>
      <span className="text-pink-400 font-bold">Front End Supervisor</span>  

        <br />
        <span className="text-gray-300 italic">📅 Mar 2016 - Jan 2018</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>👥 Supervised 15+ employees, managing cashiers & store operations.</li>
        <li>💵 Handled store cash orders, ensuring financial accuracy.</li>
      </ul>
      

      <p className="text-lg">
      <h4 className="text-3xl font-extrabold text-yellow-400"> <br/> Santander N.A. </h4>
      <span className="text-pink-400 font-bold">Bank Teller</span>  
        <br />
        <span className="text-gray-300 italic">📅 Apr 2014 - Sep 2015</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>💰 Managed high-value transactions, including $10K signing authority.</li>
        <li>🏦 Oversaw  ATM operations with $120K cash management</li>
      </ul>


      <p className="text-lg">
      <h4 className="text-3xl font-extrabold text-yellow-400"> <br/> Walmart</h4>
      <span className="text-pink-400 font-bold">Customer Service Manager</span>  

        <br />
        <span className="text-gray-300 italic">📅 Sep 2013 - Apr 2014</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>📊 Managed front-end operations, overseeing cash registers & self-checkouts</li>
        <li>👥 Led a team of 15+ employees, ensuring smooth operations.</li>
      </ul>


      <p className="text-lg">
      <h4 className="text-3xl font-extrabold text-yellow-400">Walgreens</h4>
      <span className="text-pink-400 font-bold">Service Clerk</span>          <br />
        <span className="text-gray-300 italic">📅 May 2012 - May 2014</span>
      </p>
      <ul className="list-none space-y-2 text-lg">
        <li>🌟 Delivered exceptional customer service, assisting with promotions & product knowledge.</li>
        <li>🛒 Led merchandising & store resets, keeping displays fresh & engaging.</li>
      </ul>
      <h4 className="text-3xl font-extrabold pb-10 text-yellow-400"> <br/> Summer youth Employment program </h4>


<span className="text-pink-400 font-bold">Bristol City Hall</span><br/>
<span className="text-gray-300 italic">📅 Summer 2011</span>

<ul className="list-none space-y-2 pb-10 text-lg"> <li>📞 Managed incoming calls, assisting residents with inquiries and directing them to the correct departments.</li> <li>📂 Handled clerical tasks, including data entry, filing, and document organization.</li> <li>🤝 Provided customer service, greeting visitors and scheduling appointments for town officials.</li> </ul>
<span className="text-pink-400  font-bold">Imagination Museum</span> <br/>
<span className="text-gray-300 italic">📅 Summer 2010</span>

<ul className="list-none space-y-2 text-lg"> <li>🎨 Assisted museum staff in hosting engaging youth events and interactive exhibits.</li> <li>🧹 Performed light maintenance to keep displays and public areas clean & functional.</li> <li>🛡️ Helped enforce safety protocols, ensuring a fun and secure environment for children and families.</li> </ul>

    </div>
  </div>
)}


{activeTab === "contact" && (
  <div className="relative p-6 text-white text-3xl font-bold rounded-lg shadow overflow-hidden">
    {/* Background Animation */}
    <div className="absolute inset-0 z-0 bg-[url('contactsssss.webp')] bg-cover bg-center"></div>

    {/* Content */}
    <div className="relative z-10 p-6 bg-black/50 rounded-lg">
      {/* Dropdown Options */}
      <div className="mb-10">
        {/* Performance Booking Card (Admin Only) */}
        {user?.is_admin && (
          <>
            <div
              onClick={() => setShowPerformanceForm(!showPerformanceForm)}
              className="cursor-pointer p-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white text-center font-bold shadow-lg hover:scale-105 transition-transform"
            >
              {showPerformanceForm
                ? "Hide Performance Booking"
                : "Performance Booking"}
            </div>
            {showPerformanceForm && (
              <div className="mb-4">
                <PerformanceForm />
              </div>
            )}

            {/* Engineering Booking Card (Admin Only) */}
            <div
              onClick={() => setShowEngineeringForm(!showEngineeringForm)}
              className="cursor-pointer p-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-center font-bold shadow-lg hover:scale-105 transition-transform"
            >
              {showEngineeringForm
                ? "Hide Engineering Booking"
                : "Engineering Booking"}
            </div>
            {showEngineeringForm && (
              <div className="mb-4">
                <EngineeringForm />
              </div>
            )}
          </>
        )}

        {/* Contact Info Card (Visible to All) */}
        <div
          onClick={() => setShowContactInfo(!showContactInfo)}
          className="cursor-pointer p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center font-bold shadow-lg hover:scale-105 transition-transform"
        >
          {showContactInfo ? "Hide Contact Form" : "Get in Touch"}
        </div>
        <br/>
        {showContactInfo && (
          <div className="mb-4">
            <ContactForm />
          </div>
        )}
      </div>
    </div>
  </div>
)}

        </div>
      </div>

      {/* Basic Services Tab */}
      {/* Basic Services Tab */}
      {activeTab === "basic-services" && (
        <div className="relative z-10 text-center p-8 min-h-[500px] rounded-lg shadow-lg overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-700 to-yellow-700 animate-pulse opacity-70"></div>
          <div className="absolute inset-0 bg-[url('/services-bg.jpg')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Content */}
          <div className="relative z-20">
            <h2 className="text-4xl font-bold text-white mb-6">Services</h2>
            <p className="text-2xl text-gray-200 mb-8">
              Explore our wide range of services, including performance
              bookings, software engineering, consultation, and bartending
              services. To get started, submit a request under the Contact tab,
              and we'll guide you through the booking process once we've
              finalized the details for exceptional quality and expertise.
            </p>
            {/* "Submit A Booking Request" Button */}
            <div className="relative z-20 mb-6 flex justify-center">
              <button
                onClick={() => setActiveTab("contact")} // Set the activeTab to "contact"
                className="px-6 py-3 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
              >
                Submit A Booking Request
              </button>
            </div>
            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Performance Services Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-left">
                <h3 className="text-4xl font-bold text-black mb-4">
                  Performance Services
                </h3>
                <p className="text-gray-700 mb-4">
                  Enjoy karaoke hosting, DJ services, and live performances for
                  parties, company events, weddings, and more. Customized
                  playlists and add-ons available!
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  <strong>Pricing:</strong>
                  <br /> - Private Parties: $120 (4 hours)
                  <br /> - Company Events: $200 minimum (4 hours)
                  <br /> - Weddings: $350 minimum (6 hours)
                  <br /> - Deluxe All-Day Event: $500
                </p>
                <a
                  href="https://buy.stripe.com/aEU4gvdOa6qi8kEfYZ" // Replace with actual link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-center text-2xl rounded-full bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-transform"
                >
                  Performance Services Payment
                </a>
              </div>

              {/* Software Engineering Services Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-left">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Software Engineering Services
                </h3>
                <p className="text-gray-700 mb-4">
                  Professional website development for static and dynamic
                  applications, as well as enterprise solutions. Consultation
                  and code reviews available.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  <strong>Pricing:</strong>
                  <br /> - Static Websites: Starting at $65/page
                  <br /> - Dynamic Applications: Starting at $250
                  <br /> - Enterprise Applications: Starting at $400
                </p>
                <a
                  href="https://buy.stripe.com/bIY14j9xUcOG58sfZ0" // Replace with actual link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-center rounded-full text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-transform"
                >
                  Engineering Services Payment
                </a>
              </div>

              {/* Consultation Services Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-left">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Consultation Services
                </h3>
                <p className="text-gray-700 mb-4 text-lg">
                  Get expert guidance on software engineering, project
                  architecture, debugging, and tech stack selection. Tailored
                  advice for your specific needs.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  <strong>Pricing:</strong>
                  <br /> - Software Consultation: $30/hr
                  <br /> - Code Review: $50 flat fee
                  <br /> - API Integration: Starting at $75/service
                </p>
                <a
                  href="https://buy.stripe.com/4gwbIX8tQcOG8kE000" // Replace with actual link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-2xl text-center rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-transform"
                >
                  Consultation Services Payment
                </a>
              </div>

              {/* Bartending Services Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-left">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Bartending Services
                </h3>
                <p className="text-gray-700 mb-4 text-lg">
                  Professional bartending services for private parties,
                  weddings, and corporate events. Experienced and TIPS-certified
                  for responsible alcohol service.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  <strong>Pricing:</strong>
                  <br /> - Starting at $25/hr
                  <br /> - Includes setup and cleanup
                  <br /> - Custom drink menus available
                </p>
                <a
                  href="https://buy.stripe.com/cN27sH11o15Y44o8wz" // Replace with actual link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 text-center text-2xl rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-transform"
                >
                  Bartending Services Payment
                </a>
              </div>
             
            </div>
            
          </div>

        </div>
        
      )}
    </div>
    
  );
}
