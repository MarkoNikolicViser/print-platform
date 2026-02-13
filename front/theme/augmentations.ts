import { PaletteColorOptions, SxProps } from '@mui/material/styles';

// Internal interfaces for extension
interface PaletteColorExtension {
  subtle?: string;
  subtleHover?: string;
  subtleContrast?: string;
}

interface TypographyExtension {
  display1: React.CSSProperties;
  display2: React.CSSProperties;
}

interface ComponentsExtension {
  MuiDataGrid?: {
    styleOverrides?: {
      root?: SxProps | undefined;
    };
  };
}

declare module '@mui/material/styles' {
  interface Palette {
    surfaceBorder: string;
    interactiveBorder: string;
    category1: PaletteColor;
    category2: PaletteColor;
    category3: PaletteColor;
    category4: PaletteColor;
    category5: PaletteColor;
    category6: PaletteColor;
    category7: PaletteColor;
    category8: PaletteColor;
  }

  interface PaletteOptions {
    surfaceBorder?: string;
    interactiveBorder?: string;
    category1?: PaletteColorOptions;
    category2?: PaletteColorOptions;
    category3?: PaletteColorOptions;
    category4?: PaletteColorOptions;
    category5?: PaletteColorOptions;
    category6?: PaletteColorOptions;
    category7?: PaletteColorOptions;
    category8?: PaletteColorOptions;
  }

  interface SimplePaletteColorOptions extends PaletteColorExtension {}
  
  interface PaletteColor extends PaletteColorExtension {}
  
  interface TypographyVariants extends TypographyExtension {}
  
  interface TypographyVariantsOptions extends Partial<TypographyExtension> {}
  
  interface Components extends ComponentsExtension {}

  interface TypeAction {
    selectedHover?: string;
    selectedFocus?: string;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true;
    display2: true;
  }
}
