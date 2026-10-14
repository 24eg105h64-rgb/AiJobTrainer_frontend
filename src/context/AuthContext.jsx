import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { DEMO_TOKEN, endDemoSession, getDemoUser, isDemoMode, startDemoSession } from '../services/demoApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aiJobTrainerToken') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (token === DEMO_TOKEN && isDemoMode()) {
      setUser(getDemoUser());
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('aiJobTrainerToken');
        setToken('');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    endDemoSession();
    const response = await api.post('/auth/login', { email, password });
    const nextToken = response.data.token;
    localStorage.setItem('aiJobTrainerToken', nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    endDemoSession();
    const response = await api.post('/auth/register', userData);
    const nextToken = response.data.token;
    localStorage.setItem('aiJobTrainerToken', nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    return response.data;
  };

  const loginDemo = () => {
    const demoUser = startDemoSession();
    localStorage.setItem('aiJobTrainerToken', DEMO_TOKEN);
    setToken(DEMO_TOKEN);
    setUser(demoUser);
  };

  const logout = () => {
    endDemoSession();
    localStorage.removeItem('aiJobTrainerToken');
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      loginDemo,
      register,
      logout,
      setUser,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
