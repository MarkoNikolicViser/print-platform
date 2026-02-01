'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { strapiService } from '@/services/strapiService';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* -------------------- BOOTSTRAP AUTH -------------------- */
  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      setLoading(true);
      try {
        // poziva se cookie-based /users/me
        const me = await strapiService.getMe();
        if (mounted) setUser(me);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrapAuth();
    return () => { mounted = false; };
  }, []);

  /* -------------------- LOGIN / REGISTER -------------------- */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await strapiService.loginUser(email, password);
      setUser(user);
      router.push('/store');
    } finally {
      setLoading(false);
    }
  };

  const loginSSO = async (jwt: string, ssoUser: User) => {
    setLoading(true);
    try {
      await strapiService.loginSSO(jwt, ssoUser); // postavlja token ako backend ne postavlja cookie
      setUser(ssoUser);
      router.push('/store');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      const { user } = await strapiService.registerUser(username, email, password);
      setUser(user);
      router.push('/store');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const logout = async () => {
    setLoading(true);
    try {
      await strapiService.logout();
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginSSO,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}