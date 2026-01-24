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

export interface AppUser {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 pri refreshu – proveri ko je user (cookie → Strapi)
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

    // cookie je source of truth (middleware)
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
