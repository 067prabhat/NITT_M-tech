import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// AuthContext Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage for token
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the token to get the user's information (including role)
      const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
      setCurrentUser({
        userId: decodedUser.userId,
        role: decodedUser.role,  // Store the role along with userId
      });
    }
  }, []);

  const logout = () => {
    // Clear user data from localStorage and update the currentUser state
    localStorage.removeItem("token");
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
