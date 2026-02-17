'use client';

import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Badge,
  useMediaQuery,
  useTheme,
  Container,
  Stack,
} from '@mui/material';
import { Bell, LogOut, User, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { alpha } from '@mui/material/styles';
import { Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { Menu, MenuItem, Divider, ListItemIcon, ListItemText, Switch } from '@mui/material';
import { useState } from 'react';

export function AdminHeader({ shopInfo }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { mutate: logout } = useLogout();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    setTimeout(() => router.push('/'), 500);
  };

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
          }}
        >
          {/* LEFT */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Printer size={20} color={theme.palette.primary.main} />

            <Box>
              <Typography fontWeight={800} color="primary.main">
                Go2Copy Admin
              </Typography>
              {!isMobileOrTablet && (
                <Typography variant="caption" color="text.secondary">
                  {shopInfo?.name || 'Prodavnica nije kreirana'}
                </Typography>
              )}
            </Box>

            {shopInfo && (
              <Chip
                label={shopInfo?.is_active ? 'Aktivno' : 'Neaktivno'}
                size="small"
                sx={{
                  ml: 1,
                  fontWeight: 600,
                  bgcolor: shopInfo?.is_active
                    ? alpha(theme.palette.success.main, 0.15)
                    : alpha(theme.palette.error.main, 0.15),
                  color: shopInfo?.is_active
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                }}
              />
            )}
          </Stack>

          {/* RIGHT */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton size="small">
              <Badge badgeContent={3} color="error">
                <Bell size={18} />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenuOpen} size="small">
              <MenuIcon size={20} />
            </IconButton>
          </Stack>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                minWidth: 220,
                mt: 1,
                borderRadius: 2,
              },
            }}
          >
            {/* USER INFO */}
            <Box px={2} py={1.5}>
              <Typography fontWeight={700}>{user?.username}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <Divider />

            {/* THEME SWITCH */}
            <MenuItem>
              <ListItemIcon>
                {theme.palette.mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </ListItemIcon>
              <ListItemText>Promeni temu</ListItemText>
              <Switch
                checked={theme.palette.mode === 'dark'}
                onChange={() => {
                  // 👇 Ovde pozovi svoju toggleTheme funkciju
                  console.log('toggle theme');
                }}
              />
            </MenuItem>

            <Divider />

            {/* LOGOUT */}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
            >
              <ListItemIcon>
                <LogOut size={18} />
              </ListItemIcon>
              <ListItemText>Odjavi se</ListItemText>
            </MenuItem>
          </Menu>

        </Container>
      </Toolbar>
    </AppBar>
  );
}
