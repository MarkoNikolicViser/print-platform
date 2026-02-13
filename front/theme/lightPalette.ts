import { PaletteOptions } from '@mui/material/styles';
import { grey } from './colors';

export const lightPalette: PaletteOptions = {
 mode: 'light',
 common: {
   black: '#000000',
   white: '#FFFFFF',
 },
 primary: {
   main: '#2563EB',
   light: '#60A5FA',
   dark: '#1D4ED8',
   contrastText: '#FFFFFF',
   subtle: '#DBEAFE',        // blue-100
   subtleHover: '#BFDBFE',   // blue-200
   subtleContrast: '#1E3A8A' // blue-900
 },
 secondary: {
   main: '#F59E0B',
   light: '#FBBF24',
   dark: '#D97706',
   contrastText: '#111827',
   subtle: '#FEF3C7',        // amber-100
   subtleHover: '#FDE68A',   // amber-200
   subtleContrast: '#78350F' // amber-900
 },
 success: {
   main: '#16A34A',
   light: '#4ADE80',
   dark: '#15803D',
   contrastText: '#FFFFFF',
   subtle: '#DCFCE7',
   subtleHover: '#BBF7D0',
   subtleContrast: '#052E16',
 },
 warning: {
   main: '#F59E0B',
   light: '#FCD34D',
   dark: '#B45309',
   contrastText: '#111827',
   subtle: '#FEF3C7',
   subtleHover: '#FDE68A',
   subtleContrast: '#78350F',
 },
 error: {
   main: '#DC2626',
   light: '#F87171',
   dark: '#991B1B',
   contrastText: '#FFFFFF',
   subtle: '#FEE2E2',
   subtleHover: '#FECACA',
   subtleContrast: '#7F1D1D',
 },
 info: {
   main: '#0EA5E9',
   light: '#38BDF8',
   dark: '#0369A1',
   contrastText: '#FFFFFF',
   subtle: '#E0F2FE',
   subtleHover: '#BAE6FD',
   subtleContrast: '#082F49',
 },
 grey,
 text: {
   primary: '#020617',
   secondary: '#475569',
   disabled: 'rgba(2,6,23,0.38)',
 },
 background: {
   default: '#F9FAFB',
   paper: '#FFFFFF',
 },
 divider: '#E5E7EB',
 surfaceBorder: '#E5E7EB',
 interactiveBorder: '#CBD5E1',
 action: {
   active: 'rgba(2,6,23,0.54)',
   hover: 'rgba(2,6,23,0.04)',
   hoverOpacity: 0.04,
   selected: 'rgba(37,99,235,0.08)',
   selectedHover: 'rgba(37,99,235,0.12)',
   selectedOpacity: 0.08,
   disabled: 'rgba(2,6,23,0.26)',
   disabledBackground: 'rgba(2,6,23,0.12)',
   disabledOpacity: 0.38,
   focus: 'rgba(37,99,235,0.12)',
   focusOpacity: 0.12,
   activatedOpacity: 0.12,
 },
 tonalOffset: 0.2,
 contrastThreshold: 4.5,
 // Kategorije – uklopljene sa blue / amber identitetom
 category1: {
   main: '#2563EB',
   contrastText: '#FFFFFF',
   subtle: '#DBEAFE',
   subtleHover: '#BFDBFE',
   subtleContrast: '#1E3A8A',
 },
 category2: {
   main: '#16A34A',
   contrastText: '#FFFFFF',
   subtle: '#DCFCE7',
   subtleHover: '#BBF7D0',
   subtleContrast: '#14532D',
 },
 category3: {
   main: '#0EA5E9',
   contrastText: '#FFFFFF',
   subtle: '#E0F2FE',
   subtleHover: '#BAE6FD',
   subtleContrast: '#0C4A6E',
 },
 category4: {
   main: '#F59E0B',
   contrastText: '#111827',
   subtle: '#FEF3C7',
   subtleHover: '#FDE68A',
   subtleContrast: '#78350F',
 },
 category5: {
   main: '#8B5CF6',
   contrastText: '#FFFFFF',
   subtle: '#EDE9FE',
   subtleHover: '#DDD6FE',
   subtleContrast: '#4C1D95',
 },
 category6: {
   main: '#EC4899',
   contrastText: '#FFFFFF',
   subtle: '#FCE7F3',
   subtleHover: '#FBCFE8',
   subtleContrast: '#831843',
 },
 category7: {
   main: '#14B8A6',
   contrastText: '#FFFFFF',
   subtle: '#CCFBF1',
   subtleHover: '#99F6E4',
   subtleContrast: '#134E4A',
 },
 category8: {
   main: '#F97316',
   contrastText: '#FFFFFF',
   subtle: '#FFEDD5',
   subtleHover: '#FED7AA',
   subtleContrast: '#7C2D12',
 },
};