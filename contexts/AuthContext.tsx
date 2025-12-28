
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  login: (email: string) => void;
  logout: () => void;
  subscribe: () => void;
  cancelSubscription: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    // Mock persistence
    const storedUser = localStorage.getItem('nextwin_user');
    const storedSub = localStorage.getItem('nextwin_subscribed');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedSub) {
      setIsSubscribed(JSON.parse(storedSub));
    }
  }, []);

  const login = (email: string) => {
    const mockUser: User = { id: '1', email, name: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('nextwin_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsSubscribed(false);
    localStorage.removeItem('nextwin_user');
    localStorage.removeItem('nextwin_subscribed');
  };

  const subscribe = () => {
    if (user) {
      setIsSubscribed(true);
      localStorage.setItem('nextwin_subscribed', 'true');
    }
  };

  const cancelSubscription = () => {
    setIsSubscribed(false);
    localStorage.setItem('nextwin_subscribed', 'false');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isSubscribed,
    login,
    logout,
    subscribe,
    cancelSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
