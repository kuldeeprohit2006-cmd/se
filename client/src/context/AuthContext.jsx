import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mediguard_token'));
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('mediguard_token');
      if (storedToken) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data.user);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('mediguard_token');
          localStorage.removeItem('mediguard_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('mediguard_token', data.token);
    localStorage.setItem('mediguard_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, college, phone, campusLocation) => {
    const { data } = await API.post('/auth/register', { name, email, password, college, phone, campusLocation });
    localStorage.setItem('mediguard_token', data.token);
    localStorage.setItem('mediguard_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const loginWithGoogle = async (googlePayload) => {
    const { data } = await API.post('/auth/google', googlePayload);
    localStorage.setItem('mediguard_token', data.token);
    localStorage.setItem('mediguard_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mediguard_token');
    localStorage.removeItem('mediguard_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
