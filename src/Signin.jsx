import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Signin({ setActiveTab }) { // Accept setActiveTab as a prop
  const { login, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false); // For flashing message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      setShowWelcome(true); // Show welcome message
      setTimeout(() => {
        setShowWelcome(false); // Hide welcome message after 5 seconds
        setActiveTab("admin-dashboard"); // Change tab to Admin Dashboard
      }, 5000);
    }
  };

  return (
    <div
      className="flex rounded-2xl items-center justify-center min-h-screen overflow-hidden"

    >
      {showWelcome ? (
        <div className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-pink-600 
  animate-pulse shadow-2xl shadow-yellow-400 p-10 rounded-2xl border-4 border-pink-400 border-dashed transform scale-105 hover:scale-110 transition-all duration-500 ease-out">
  🎉 Welcome Back Daddy 🎉
</div>

      ) : (
        <div className="bg-red-200 p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border text-center text-black rounded-lg p-2"
                placeholder="Welcome Back"
                required
              />
            </div>
            <div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-center text-black border rounded-lg p-2"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
