import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import magicSound from "/magic2.mp3";

export default function Signin({ setActiveTab }) {
  const { login, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showErrorBackground, setShowErrorBackground] = useState(false);
  const audioFile = "/magic.mp3"; // 🔥 Ensure it's inside `public/`

  // 🔊 Reference for audio playback
  const audioRef = useState(new Audio("/magic2.mp3"))[0];

  useEffect(() => {
    if (showErrorBackground) {
      audioRef.play().catch(err => console.error("Audio play failed:", err)); // Play sound
    }
  }, [showErrorBackground]); // Runs when showErrorBackground changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        setActiveTab("admin-dashboard");
      }, 4000);
    } else {
      setShowErrorBackground(true);
    }
  };

  return (
    <div
      className={`flex items-center min-w-full justify-center min-h-screen transition-all duration-500 ease-in-out ${
        showErrorBackground ? "bg-cover bg-center" : "bg-gradient-to-r from-gray-900 via-black to-gray-900"
      }`}
      style={{
        backgroundImage: showErrorBackground
          ? "url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDhuazMzZnYyeWYxOGR3NWk5N283aGt5Z3NqYmZxZ2p2dDVjZnJ4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5ftsmLIqktHQA/giphy.gif')"
          : "linear-gradient(to right, #1a1a2e, #16213e, #0f3460)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Audio element for error sound */}
      <audio ref={audioRef} src={audioFile} preload="auto"></audio>

      {showWelcome ? (
        <div className="text-xl sm:text-2xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-pink-600 
          animate-pulse shadow-2xl shadow-yellow-400  rounded-3xl border-4 border-pink-400 border-dashed transform scale-105 hover:scale-110 transition-all duration-200 ease-out">
          🎉 Welcome Back, Daddy 🎉
        </div>
      ) : (
        <div className="w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-600 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white drop-shadow-lg mb-6">
            🔐 Sign In
          </h2>

          {error && (
            <p className="text-red-500 text-center font-semibold animate-pulse">
              🚨 Access Denied 🚨
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowErrorBackground(false);
                }}
                className="w-full bg-black bg-opacity-50 text-white text-center text-lg px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                placeholder="👤 Username"
                required
              />
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowErrorBackground(false);
                }}
                className="w-full bg-black bg-opacity-50 text-white text-center text-lg px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                placeholder="🔑 Password"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-lg font-bold text-white rounded-xl shadow-lg transform transition-all duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed animate-pulse"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95"
              }`}
              disabled={loading}
            >
              {loading ? "🔄 Signing in..." : "🚀 Sign In"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
