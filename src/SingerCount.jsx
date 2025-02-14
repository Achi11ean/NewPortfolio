import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function SingerCount({ singerCounts, isLoading }) {
  const { user } = useAuth(); // Get the current user
  const [isOpen, setIsOpen] = useState(false);
  const [openSingers, setOpenSingers] = useState({});
  const [initialSingers, setInitialSingers] = useState([]); // Store initial list of singers
  const [newSingers, setNewSingers] = useState([]); // Track new singers since refresh

  // Update initial singers and track new ones when data changes
  useEffect(() => {
    if (initialSingers.length === 0) {
      setInitialSingers(singerCounts); // Set initial list on first load
    } else {
      // Find new singers who were not in the initial list
      const newAdded = singerCounts.filter(
        (singer) => !initialSingers.some((initial) => initial.name === singer.name)
      );
      setNewSingers(newAdded);
    }
  }, [singerCounts]); // Runs whenever singerCounts updates

  // Toggle main dropdown & close all singer submenus if closing
  const toggleMainDropdown = () => {
    setIsOpen((prev) => {
      if (prev) setOpenSingers({}); // Close all submenus when closing main dropdown
      return !prev;
    });
  };

  // Toggle a specific singer's dropdown
  const toggleSinger = (name) => {
    setOpenSingers((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="max-w-sm mx-auto mt-4 p-4 bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 text-white rounded-3xl shadow-2xl border-4 border-yellow-300">
      
      {/* Admin-Only New Singers Counter */}

        <p className="text-center text-sm font-bold text-yellow-300 mb-2">
          🚀 {newSingers.length} new singer{newSingers.length !== 1 ? "s" : ""} added since refresh
        </p>
      {/* Toggle Main Dropdown */}
      <button
        onClick={toggleMainDropdown}
        className="w-full flex justify-between items-center text-left text-2xl font-extrabold p-3 
                   bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl shadow-lg 
                   transform transition-all duration-300 hover:scale-105 active:scale-95"
      >
        🎤 Singer Count
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
          ⬇️
        </span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="mt-3 p-3 bg-gray-900 bg-opacity-80 rounded-2xl shadow-inner max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-800">
          {isLoading ? (
            <p className="text-center text-gray-300 animate-pulse">Loading...</p>
          ) : singerCounts.length === 0 ? (
            <p className="text-center text-gray-300">No singers yet. 🎤</p>
          ) : (
            <ul className="space-y-3">
              {singerCounts.map((singer, index) => {
                const isNew = newSingers.some((newSinger) => newSinger.name === singer.name);
                return (
                  <li 
                    key={index} 
                    className={`bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md ${isNew ? "border-2 border-yellow-300" : ""}`}
                  >
                    {/* Singer Name + Count - Toggle Button */}
                    <button
                      onClick={() => toggleSinger(singer.name)}
                      className="w-full flex justify-between items-center text-left text-lg font-semibold p-3 text-white hover:bg-purple-700 rounded-lg transition-all"
                    >
                      <span>
                        {singer.name} <span className="text-yellow-300 font-bold">({singer.count}x)</span>
                        {isNew && <span className="ml-2 text-green-300 font-bold">✨ New</span>}
                      </span>
                      <span className={`transform transition-transform ${openSingers[singer.name] ? "rotate-180" : "rotate-0"}`}>
                        ⬇️
                      </span>
                    </button>
                
                    {/* Songs List */}
                    {openSingers[singer.name] && (
                      <ul className="mt-2 pl-5 text-white bg-black bg-opacity-40 rounded-lg p-3">
                        {singer.songs.map((song, i) => (
                          <li key={i} className="pl-3 before:content-['🎵'] before:mr-1">
                            {song}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
