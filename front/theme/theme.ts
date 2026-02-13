import { createTheme, alpha, PaletteMode } from '@mui/material/styles';
import './augmentations';
import { lightPalette } from './lightPalette';
import { darkPalette } from './darkPalette';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { components } from './components';

const getPalette = (mode: PaletteMode) => (mode === 'light' ? lightPalette : darkPalette);

export const createAppTheme = (mode: PaletteMode = 'light') =>
  createTheme({
    palette: getPalette(mode),
    shape: {
      borderRadius: 12,
    },
    typography,
    breakpoints,
    components,
  });

/**
 * Default theme (backward compatibility)
 */
export const theme = createAppTheme('light');

/**
 * Helper za glow (hero sekcije)
 */
export const radialGlow = (theme: ReturnType<typeof createAppTheme>) =>
  `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`;
