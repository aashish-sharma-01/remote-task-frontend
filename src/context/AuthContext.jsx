import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersApi, setAuthToken } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('syncpulse_theme') || 'dark');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Load members from the backend (MongoDB) on first mount
  useEffect(() => {
    (async () => {
      try {
        const fetchedMembers = await usersApi.getAll();
        setMembers(fetchedMembers);

        const savedUserId = localStorage.getItem('syncpulse_user_id');
        const restored = savedUserId
          ? fetchedMembers.find((m) => m.id === savedUserId)
          : null;

        if (restored) {
          setCurrentUser(restored);
        } else {
          setIsAuthModalOpen(true);
        }
      } catch (err) {
        console.error('Failed to load members from backend:', err);
        addToast('Could not reach the backend. Is the server running?', 'error');
        setIsAuthModalOpen(true);
      } finally {
        setIsLoadingMembers(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('syncpulse_user_id', currentUser.id);
    } else {
      localStorage.removeItem('syncpulse_user_id');
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('syncpulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    addToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} theme`, 'info');
  };

  const login = async (email, password) => {
    try {
      const found = await usersApi.login(email, password);
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      addToast(`Welcome back, ${found.name}!`, 'success');
      return { success: true };
    } catch (err) {
      addToast(err.message || 'Invalid email or password.', 'error');
      return { success: false, error: err.message };
    }
  };

  const signup = async (userData) => {
    try {
      const newUser = await usersApi.signup(userData);
      setMembers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthModalOpen(false);
      addToast(`Welcome to SyncPulse, ${newUser.name}!`, 'success');
      return { success: true };
    } catch (err) {
      addToast(err.message || 'Could not create account.', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setIsAuthModalOpen(true);
    addToast('Logged out successfully', 'info');
  };

  // Demo accounts (seeded via `npm run seed`) all share the same password
  const DEMO_PASSWORD = 'password123';

  const loginAsDemo = async (userId) => {
    const target = members.find((m) => m.id === userId);
    if (!target) return;
    try {
      const found = await usersApi.login(target.email, DEMO_PASSWORD);
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      addToast(`Logged in as ${found.name} (${found.role})`, 'success');
    } catch (err) {
      addToast('Demo login failed. Run "npm run seed" in the backend folder first.', 'error');
    }
  };

  const updateStatus = async (newStatus, newStatusText) => {
    if (!currentUser) return;
    try {
      const updated = await usersApi.update(currentUser.id, {
        status: newStatus,
        statusText: newStatusText !== undefined ? newStatusText : currentUser.statusText
      });
      setCurrentUser(updated);
      setMembers((prev) => prev.map((m) => (m.id === currentUser.id ? updated : m)));
      addToast(`Status updated to ${newStatus.toUpperCase()}`, 'info');
    } catch (err) {
      addToast('Could not update status.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        members,
        isLoadingMembers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        theme,
        toggleTheme,
        login,
        signup,
        logout,
        loginAsDemo,
        updateStatus,
        toasts,
        addToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
