import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    const storedTheme = localStorage.getItem("theme") || 'dark';
    setTheme(storedTheme);
    document.body.className = storedTheme === 'dark' ? 'dark-mode' : 'light-mode';

    initializeAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-mode' : 'light-mode';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
