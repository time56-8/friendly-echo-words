
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'mentor' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // Check localStorage on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUserRole(authData.role);
      } catch (e) {
        // Invalid stored data
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple authentication logic
    if (email === "admin@edpay.com" && password === "password") {
      setIsAuthenticated(true);
      setUserRole('admin');
      localStorage.setItem('auth', JSON.stringify({ role: 'admin' }));
      return true;
    } else if (email.includes("mentor") && password === "password") {
      setIsAuthenticated(true);
      setUserRole('mentor');
      localStorage.setItem('auth', JSON.stringify({ role: 'mentor' }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
