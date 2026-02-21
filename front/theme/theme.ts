import { createTheme } from '@mui/material/styles';
import './augmentations';
import { lightPalette } from './lightPalette';
import { darkPalette } from './darkPalette';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import { components } from './components';


export const theme = createTheme({
  typography,
  shape: { borderRadius: 12 },
  breakpoints,
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    dark: { palette: darkPalette },
    light: { palette: lightPalette }
  },
  components
});
