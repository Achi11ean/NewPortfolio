import { useState, useEffect } from "react";

export default function SingerCount() {
  const [singerCounts, setSingerCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Toggle for main dropdown
  const [openSingers, setOpenSingers] = useState({}); // Toggle for each singer

  useEffect(() => {
    fetch("https://portfoliobackend-ih6t.onrender.com/karaokesignup/singer_counts")
      .then((res) => res.json())
      .then((data) => {
        setSingerCounts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching singer counts:", error);
        setLoading(false);
      });
  }, []);

  // Toggle a specific singer's dropdown
  const toggleSinger = (name) => {
    setOpenSingers((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="max-w-sm mx-auto mt-4 p-4 bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 text-white rounded-3xl shadow-2xl border-4 border-yellow-300">
      
      {/* Toggle Main Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          {loading ? (
            <p className="text-center text-gray-300 animate-pulse">Loading...</p>
          ) : (
            <ul className="space-y-3">
{singerCounts.length > 0 ? (
  singerCounts.map((singer, index) => (
    <li key={index} className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-md">
      {/* Singer Name + Count - Toggle Button */}
      <button
        onClick={() => toggleSinger(singer.name)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold p-3 text-white hover:bg-purple-700 rounded-lg transition-all"
      >
        <span>
          {singer.name} <span className="text-yellow-300 font-bold">({singer.count}x)</span>
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
  ))
) : (
  <p className="text-center text-gray-300">No singers found.</p>
)}

            </ul>
          )}
        </div>
      )}
    </div>
  );
}
