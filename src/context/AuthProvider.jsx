import { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import authApi from '../services/authApi';
import linkApi from '../services/linkApi';

const USER_INFO_KEY = 'nurl_user_info';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_INFO_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      await linkApi.getDashboard();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Asynchronously check session without synchronous setState in effect body
    linkApi
      .getDashboard()
      .then(() => {
        if (isMounted) setIsAuthenticated(true);
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const handleSessionExpired = () => {
      if (isMounted) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(USER_INFO_KEY);
      }
    };

    window.addEventListener('nurl:session-expired', handleSessionExpired);
    return () => {
      isMounted = false;
      window.removeEventListener('nurl:session-expired', handleSessionExpired);
    };
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const userData = { email: credentials.email, name: credentials.email.split('@')[0] };
    setUser(userData);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
    setIsAuthenticated(true);
    return res;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    if (res?.data) {
      const userData = { email: res.data.email, name: res.data.name };
      setUser(userData);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Clean local auth state regardless of network status
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(USER_INFO_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
