import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// AuthContext Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage for token
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      setCurrentUser(userId);
    }
  }, []);

  const logout = () => {
    // Clear user data from localStorage and update the currentUser state
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
