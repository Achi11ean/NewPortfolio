import { createContext, useContext, useState } from "react";

// Create Auth Context
const AuthContext = createContext();

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user information
  const [token, setToken] = useState(localStorage.getItem("token") || null); // JWT Token
  const [error, setError] = useState(null);

  // Login Function
  const login = async (username, password) => {
    setError(null); // Clear previous errors
    try {
      const response = await fetch("https://portfoliobackend-ih6t.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
  
      // Store token and user data
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ username, is_admin: data.is_admin }); // Store is_admin flag
  
      return true; // Login success
    } catch (err) {
      setError(err.message);
      return false; // Login failed
    }
  };
  
  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
