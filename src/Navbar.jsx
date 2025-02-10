import React, { useState } from "react";

const Navbar = ({ activeTab, setActiveTab, user, token, logout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="bg-blue/10 backdrop-blur-lg shadow-lg sticky top-0 z-50 border border-white/20 ">
<div className="container mx-auto flex justify-between items-center px-6 p-1">
        {/* Logo */}
{/* Logo */}
<div className="overflow-hidden">
  <img 
    src="LOGO.webp" 
    alt="Karaoke Central Logo" 
    className="h-20 w-auto rounded-2xl object-cover scale-110 transition-transform duration-300 hover:scale-125 cursor-pointer"
  />
</div>

        <div className="text-2xl font-extrabold text-white hover:text-blue-600 transition duration-300">
          
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {[
            { tab: "welcome", label: "Welcome" },
            { tab: "karaoke", label: "Karaoke Signup" },
            { tab: "education", label: "Jwhit ©" },
            { tab: "employment", label: "Employment" },
            { tab: "reviews", label: "Reviews" },
            { tab: "passion", label: "Passion" },
            { tab: "basic-services", label: "Services" },
            { tab: "gallery", label: "Gallery" },
            { tab: "contact", label: "Contact" },
            { tab: "businessweekly", label: "Inc. + AI" },
            { tab: "admin-dashboard", label: "Admin Dashboard", adminOnly: true },
            { tab: "admin-signin", label: token ? "Sign Out" : "Admin" },
          ].map(
            ({ tab, label, adminOnly }) =>
              (!adminOnly || user?.is_admin) && (
                <button
                  key={tab}
                  className={`text-white text-lg font-medium hover:text-blue-500 transition duration-300 ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "admin-signin") {
                      token ? logout() : setActiveTab("admin-signin");
                    }
                  }}
                >
                  {label}
                </button>
              )
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-blue-500 focus:outline-none transition duration-300"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isOpen
                    ? "M6 18L18 6M6 6l12 12" // X icon
                    : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 py-4 space-y-4 text-center">
          {[
            { tab: "welcome", label: "Welcome" },
            { tab: "karaoke", label: "Karaoke Signup" },
            { tab: "education", label: "Jwhit ©" },
            { tab: "employment", label: "Employment" },
            { tab: "reviews", label: "Reviews" },
            { tab: "passion", label: "Passion" },
            { tab: "basic-services", label: "Services" },
            { tab: "gallery", label: "Gallery" },
            { tab: "contact", label: "Contact" },
            { tab: "businessweekly", label: "Inc. + AI" },
            { tab: "admin-dashboard", label: "Admin Dashboard", adminOnly: true },
            { tab: "admin-signin", label: token ? "Sign Out" : "Admin" },
          ].map(
            ({ tab, label, adminOnly }) =>
              (!adminOnly || user?.is_admin) && (
                <button
                  key={tab}
                  className="block text-gray-700 text-lg hover:text-blue-500 transition py-2"
                  onClick={() => {
                    setActiveTab(tab); // Updates the active tab correctly
                    if (tab === "admin-signin") {
                      token ? logout() : setActiveTab("admin-signin");
                    }
                    setIsOpen(false); // Closes the mobile menu after clicking
                  }}
                  
                >
                  {label}
                </button>
              )
          )}

          {/* Social Media Icons */}

        </div>
      )}
    </nav>
  );
};

export default Navbar;
