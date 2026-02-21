'use client';

import { useAuth } from '@/context/AuthContext';
import { CopyShop } from '@/types';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Chip,
  Badge,
  useMediaQuery,
  useTheme,
  Container,
  Stack,
} from '@mui/material';
import { Menu, MenuItem, Divider, ListItemIcon, ListItemText, Switch } from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import { Bell, LogOut, Printer } from 'lucide-react';
import { Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '../LanguageSwitcher';

interface Props {
  shopInfo: CopyShop | undefined;
}

export function AdminHeader({ shopInfo }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const { mode, systemMode, setMode } = useColorScheme();
  const resolvedMode = useMemo(() => {
    if (mode === 'system') return systemMode;
    return mode;
  }, [mode, systemMode]);
  const isDark = (resolvedMode ?? theme.palette.mode) === 'dark';

  const toggleTheme = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout('/login');
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
                {t('header.admin.brand')}
              </Typography>
              {!isMobileOrTablet && (
                <Typography variant="caption" color="text.secondary">
                  {shopInfo?.name || t('header.admin.noShop')}
                </Typography>
              )}
            </Box>

            {shopInfo && (
              <Chip
                label={shopInfo?.is_active ? t('header.admin.active') : t('header.admin.inactive')}
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

            <LanguageSwitcher />

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
              <ListItemIcon>{isDark ? <Sun /> : <Moon />}</ListItemIcon>
              <ListItemText>{t('header.admin.toggleTheme')}</ListItemText>
              <Switch checked={isDark} onChange={toggleTheme} />
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
              <ListItemText>{t('header.userMenu.logout')}</ListItemText>
            </MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
