import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
export default function MusicBreakAlert() {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://portfoliobackend-ih6t.onrender.com/music-break")
      .then((res) => res.json())
      .then((data) => setShowAlert(data.show_alert))
      .catch((err) => console.error("Error fetching alert state:", err));
  }, []);
  const { user } = useAuth();

  const toggleAlert = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/music-break", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ show_alert: !showAlert }),
      });

      if (response.ok) {
        const data = await response.json();
        setShowAlert(data.show_alert);
      } else {
        console.error("Failed to update alert state");
      }
    } catch (error) {
      console.error("Error toggling alert:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {showAlert && (
        <div className="relative w-full max-w-xs bg-white text-red-600 text-center rounded-full shadow-xl p-3 
                        animate-fadeInOut flex justify-center items-center">
          <p className="text-lg font-bold tracking-wide animate-bounce">
            🎶 Music Break 🎵<br/> ⏰ We’ll Be Back Soon! 🎤
          </p>
        </div>
      )}
    {user?.is_admin && (

      <button
        onClick={toggleAlert}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-700 text-white font-bold text-md rounded-full shadow-md transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-purple-300 disabled:opacity-50"
      >
        {loading ? "Updating..." : showAlert ? "🎵 Resume the Show!" : "🎤 Take a Music Break!"}
      </button>
    )}
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .animate-fadeInOut {
          animation: fadeInOut 4s ease-in-out infinite;
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
