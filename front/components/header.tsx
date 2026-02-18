'use client';

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
  Container,
  Stack,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Menu as MenuIcon, LogOut, User, Sun, Moon, Printer } from 'lucide-react';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCartItemCount } from '../hooks/useCartItemCount';
import CartButton from './ui/CartButton';
import GoogleOneTapButton from './ui/GoogleOneTapButton';

type LocalUser = {
  username?: string;
  email?: string;
  avatarUrl?: string;
};

export function Header() {
  const router = useRouter();
  const theme = useTheme();

  // IMPORTANT: compute responsive breakpoint only on client to avoid SSR/CSR mismatch
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  // Mounted flag to avoid rendering different trees on server vs client
  const [mounted, setMounted] = useState(false);

  // Client-only state
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<LocalUser | null>(null);
  const [admin, setAdmin] = useState<any>(null);

  // Menus / anchors
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userMenuAnchor);
  const moreMenuOpen = Boolean(moreMenuAnchor);

  // Mark as mounted and read client storage AFTER mount
  useEffect(() => {
    setMounted(true);

    try {
      const storedOrderId = localStorage.getItem('order_code') ?? undefined;
      setOrderId(storedOrderId || undefined);
    } catch {
      // ignore
    }

    try {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch {
      // ignore
    }

    try {
      const adminData = localStorage.getItem('admin');
      if (adminData) setAdmin(JSON.parse(adminData));
    } catch {
      // ignore
    }
  }, []);

  // Cart count (safe even if orderId is undefined; your hook should handle it)
  const { data: cartCounter } = useCartItemCount(orderId);
  const cartQty = cartCounter?.count ?? 0;

  // Handlers
  const handleLogin = () => router.push('/login');

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
    } catch { }
    setUser(null);
    setAdmin(null);
    setTimeout(() => router.push('/'), 500);
  };

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) =>
    setUserMenuAnchor(e.currentTarget);
  const handleCloseUserMenu = () => setUserMenuAnchor(null);

  const handleOpenMoreMenu = (e: React.MouseEvent<HTMLElement>) =>
    setMoreMenuAnchor(e.currentTarget);
  const handleCloseMoreMenu = () => setMoreMenuAnchor(null);

  // Theme switch placeholder
  const isDark = theme.palette.mode === 'dark';
  const toggleTheme = () => {
    // Hook your real theme toggler here (e.g., context or next-themes)
    console.log('toggle theme');
  };

  // If you need a shop chip later
  const shopChip: React.ReactNode | null = null;

  /**
   * IMPORTANT: To avoid hydration mismatch, ensure the structure of the AppBar
   * is stable. We keep the overall layout identical, and only swap inner content
   * that is known to be client-only once `mounted` is true.
   *
   * For example:
   * - Before mount: render neutral placeholders (icons/empty avatar/login button)
   *   that won't conflict with server HTML.
   * - After mount: render the real user/login or desktop/mobile branches safely,
   *   because useMediaQuery is gated behind { noSsr: true } and mounted is true.
   */

  // Pre-mount placeholders (keeps tree stable)
  const renderPreMountActions = () => (
    <>
      <CartButton quantity={0} onClick={() => { }} />
      <IconButton size="small" sx={{ ml: 0.5 }} aria-label="theme-toggle-placeholder">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>
      <Button
        disabled
        startIcon={<GoogleIcon />}
        sx={{
          textTransform: 'none',
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: '-0.3px',
          borderRadius: '999px',
          bgcolor: '#fff',
          color: 'rgba(0,0,0,0.38)',
          border: '1px solid rgba(0,0,0,0.12)',
          px: 2.2,
          py: 0.9,
          minHeight: 40,
        }}
      >
        Login
      </Button>
    </>
  );

  const renderDesktopActions = () => (
    <>
      {/* Cart is always visible */}
      <CartButton quantity={cartQty} onClick={() => router.push('/home/cart')} />

      {/* Theme switch */}
      <IconButton size="small" onClick={toggleTheme} sx={{ ml: 0.5 }}>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>

      {user ? (
        <>
          {/* User avatar button */}
          <IconButton size="small" onClick={handleOpenUserMenu}>
            <Avatar
              sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.light' }}
              src={user?.avatarUrl}
            >
              {(user?.username ?? 'U')[0]?.toUpperCase()}
            </Avatar>
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={userMenuOpen}
            onClose={handleCloseUserMenu}
            PaperProps={{
              sx: {
                minWidth: 240,
                mt: 1,
                borderRadius: 2,
              },
            }}
          >
            <Box px={2} py={1.5}>
              <Typography fontWeight={700}>{user?.username ?? 'Korisnik'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={toggleTheme}>
              <ListItemIcon>{isDark ? <Sun size={18} /> : <Moon size={18} />}</ListItemIcon>
              <ListItemText>{isDark ? 'Svetla tema' : 'Tamna tema'}</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                handleLogout();
              }}
            >
              <ListItemIcon>
                <LogOut size={18} />
              </ListItemIcon>
              <ListItemText>Odjavi se</ListItemText>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <GoogleOneTapButton />
      )}
    </>
  );

  const renderMobileActions = () => (
    <>
      {/* Cart stays visible */}
      <CartButton quantity={cartQty} onClick={() => router.push('/home/cart')} />

      <IconButton size="small" onClick={handleOpenMoreMenu}>
        <MenuIcon size={20} />
      </IconButton>

      <Menu
        anchorEl={moreMenuAnchor}
        open={moreMenuOpen}
        onClose={handleCloseMoreMenu}
        PaperProps={{
          sx: {
            minWidth: 240,
            mt: 1,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            toggleTheme();
            handleCloseMoreMenu();
          }}
        >
          <ListItemIcon>{isDark ? <Sun size={18} /> : <Moon size={18} />}</ListItemIcon>
          <ListItemText>{isDark ? 'Svetla tema' : 'Tamna tema'}</ListItemText>
        </MenuItem>

        <Divider />

        {user ? (
          <>
            <Box px={2} py={1.5}>
              <Typography fontWeight={700}>{user?.username ?? 'Korisnik'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <MenuItem
              onClick={() => {
                handleCloseMoreMenu();
                handleLogout();
              }}
            >
              <ListItemIcon>
                <LogOut size={18} />
              </ListItemIcon>
              <ListItemText>Odjavi se</ListItemText>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            onClick={() => {
              handleCloseMoreMenu();
              handleLogin();
            }}
          >
            <ListItemIcon>
              <User size={18} />
            </ListItemIcon>
            <ListItemText>Prijavi se</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
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
          {/* LEFT: Brand */}
          <Stack
            sx={{ ':hover': { cursor: 'pointer' } }}
            onClick={() => router.push('/home')}
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Printer size={20} color={theme.palette.primary.main} />
            <Typography sx={{ fontWeight: 800 }} color={theme.palette.primary.main}>
              Go2Copy
            </Typography>
          </Stack>

          {/* RIGHT: Actions */}
          <Stack direction="row" alignItems="center" spacing={1.25}>
            {/* Pre-mount stable placeholders to avoid hydration mismatch */}
            {!mounted
              ? renderPreMountActions()
              : !isMobileOrTablet
                ? renderDesktopActions()
                : renderMobileActions()}
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
