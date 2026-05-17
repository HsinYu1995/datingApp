import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessToken, getAccessToken } from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateUser = useCallback(async () => {
    try {
      const { data } = await api.post('/refresh');
      setAccessToken(data.accessToken);
      const me = await api.get('/me');
      setUser(me.data);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password });
    setAccessToken(data.accessToken);
    const me = await api.get('/me');
    setUser(me.data);
  }

  async function register(email, password) {
    const { data } = await api.post('/register', { email, password });
    setAccessToken(data.accessToken);
    const me = await api.get('/me');
    setUser(me.data);
  }

  async function logout() {
    try {
      await api.post('/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
