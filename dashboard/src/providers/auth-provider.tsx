'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthState } from '@/features/auth/types';
import { authService } from '@/features/auth/services/auth.service';

interface AuthContextType extends AuthState {
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const checkAuth = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [user, session] = await Promise.all([
        authService.getCurrentUser(),
        authService.getCurrentSession(),
      ]);

      setState({
        user,
        session,
        isLoading: false,
        isAuthenticated: !!user && !!session,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        error: error as Error,
      });
    }
  };

  const logout = async () => {
    await authService.logout();
    setState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
