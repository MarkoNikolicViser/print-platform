'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
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

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await strapiService.getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    const { jwt, user } = await strapiService.loginUser(email, password);

    document.cookie = `jwt=${jwt}; path=/; SameSite=Lax`;

    setUser(user);
    router.push('/store');
  };

  const register = async (email: string, password: string, name: string) => {
    const { jwt, user } = await strapiService.registerUser(name, email, password);

    document.cookie = `jwt=${jwt}; path=/; SameSite=Lax`;

    setUser(user);
    router.push('/store');
  };

  const logout = () => {
    document.cookie = 'jwt=; path=/; max-age=0';
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
