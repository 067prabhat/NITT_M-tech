import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Function to load user from localStorage
  const loadUser = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (token && userId && role) {
      setCurrentUser({ userId, role });
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUser(); // Load user when the component mounts

    // Listen for changes in localStorage (for login/logout sync across tabs)
    window.addEventListener("storage", loadUser);
    
    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
