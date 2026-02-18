import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect,
} from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { createAppTheme } from '@/theme/theme';

type ThemeContextType = {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    // Detect system preference
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Read initial mode from localStorage or system preference
    const getInitialMode = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('themeMode');
            if (stored === 'light' || stored === 'dark') {
                return stored;
            }
            return prefersDarkMode ? 'dark' : 'light';
        }
        return 'light'; // fallback for SSR
    };

    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light'; // SSR
        const stored = localStorage.getItem('themeMode');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    // Sync with system preference only if user hasn’t overridden
    useEffect(() => {
        const stored = localStorage.getItem('themeMode');
        if (!stored) {
            setMode(prefersDarkMode ? 'dark' : 'light');
        }
    }, [prefersDarkMode]);

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const toggleTheme = () => {
        setMode(prev => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', next);
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useThemeMode must be used inside AppThemeProvider');
    return ctx;
}