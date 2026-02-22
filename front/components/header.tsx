'use client';

import { useAuth } from '@/context/AuthContext';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  Container,
  Stack,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import { LogOut, Sun, Moon, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCartItemCount } from '../hooks/useCartItemCount';
import { LanguageSwitcher } from './LanguageSwitcher';
import CartButton from './ui/CartButton';
import GoogleOneTapButton from './ui/GoogleOneTapButton';

export function Header() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userMenuAnchor);

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) =>
    setUserMenuAnchor(e.currentTarget);
  const handleCloseUserMenu = () => setUserMenuAnchor(null);

  const { mode, systemMode, setMode } = useColorScheme();
  const resolvedMode = useMemo(() => {
    if (mode === 'system') return systemMode;
    return mode;
  }, [mode, systemMode]);
  const isDark = (resolvedMode ?? theme.palette.mode) === 'dark';

  const toggleTheme = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  // Cart logic
  const orderId = undefined; // Ako ti treba orderId, možeš ga uzeti iz context ili props
  const { data: cartCounter } = useCartItemCount(orderId);
  const cartQty = cartCounter?.count ?? 0;

  const handleLogout = () => {
    handleCloseUserMenu();
    logout(); // koristi logout iz context-a
  };

  const renderUserMenu = () => (
    <Menu
      anchorEl={userMenuAnchor}
      open={userMenuOpen}
      onClose={handleCloseUserMenu}
      PaperProps={{ sx: { minWidth: 220, mt: 1, borderRadius: 2 } }}
    >
      <Box px={2} py={1.5}>
        <Typography fontWeight={700}>
          {user?.username ?? t('header.userMenu.defaultName')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>

      <Divider />

      <MenuItem onClick={toggleTheme}>
        <ListItemIcon>{isDark ? <Sun /> : <Moon />}</ListItemIcon>
        <ListItemText>
          {isDark ? t('header.userMenu.lightTheme') : t('header.userMenu.darkTheme')}
        </ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogOut size={18} />
        </ListItemIcon>
        <ListItemText>{t('header.userMenu.logout')}</ListItemText>
      </MenuItem>
    </Menu>
  );

  const renderActions = () => (
    <>
      <CartButton quantity={cartQty} onClick={() => router.push('/home/cart')} />

      <IconButton size="small" onClick={toggleTheme} sx={{ ml: 0.5 }}>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>

      <LanguageSwitcher />

      {user ? (
        <>
          <IconButton size="small" onClick={handleOpenUserMenu}>
            <Avatar
              sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.light' }}
              src={user.avatarUrl}
            >
              {(user.username ?? 'U')[0].toUpperCase()}
            </Avatar>
          </IconButton>
          {renderUserMenu()}
        </>
      ) : (
        <GoogleOneTapButton />
      )}
    </>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Brand */}
          <Stack
            sx={{ ':hover': { cursor: 'pointer' } }}
            onClick={() => router.push('/')}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Printer size={20} color={theme.palette.primary.main} />
            <Typography sx={{ fontWeight: 800 }} color={theme.palette.primary.main}>
              Go2Copy
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack direction="row" alignItems="center" spacing={1.25}>
            {renderActions()}
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
