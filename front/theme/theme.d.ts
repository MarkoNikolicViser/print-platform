import { PaletteColorOptions, SxProps } from '@mui/material/styles';

interface PaletteColorExtension {
  subtle?: string;
  subtleHover?: string;
  subtleContrast?: string;
}

interface PalletteExtension {
  surfaceBorder?: string;
  interactiveBorder?: string;
  category1?: PaletteColorOptions & PaletteColorExtension;
  category2?: PaletteColorOptions & PaletteColorExtension;
  category3?: PaletteColorOptions & PaletteColorExtension;
  category4?: PaletteColorOptions & PaletteColorExtension;
  category5?: PaletteColorOptions & PaletteColorExtension;
  category6?: PaletteColorOptions & PaletteColorExtension;
  category7?: PaletteColorOptions & PaletteColorExtension;
  category8?: PaletteColorOptions & PaletteColorExtension;
}

interface TypographyExtension {
  display1: React.CSSProperties;
  display2: React.CSSProperties;
}

interface ComponentsExtension {
  MuiDataGrid?: {
    styleOverrides?: {
      root?: SxProps;
    };
  };
}

declare module '@mui/material/styles' {
  interface Palette extends PalletteExtension {}

  interface PaletteOptions extends PalletteExtension {}

  interface SimplePaletteColorOptions extends PaletteColorExtension {}

  interface PaletteColor extends PaletteColorExtension {}

  interface TypographyVariants extends TypographyExtension {}

  interface TypographyVariantsOptions extends Partial<TypographyExtension> {}

  interface Components extends ComponentsExtension {}
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true;
    display2: true;
  }
}
