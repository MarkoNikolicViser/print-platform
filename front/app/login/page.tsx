'use client';

import { useAuth } from '@/context/AuthContext';
import { GOOGLE_CLIENT_ID, GOOGLE_URI, STRAPI_REDIRECT_URI } from '@/helpers/constants';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginData.email, loginData.password);
    } catch (err: any) {
      setError(err.message || t('login.errorLogin'));
    }
  };

  const handleGoogleLogin = () => {
    const options = {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: STRAPI_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      state: JSON.stringify({ app_role: 'shop' }),
    };

    const queryString = new URLSearchParams(options).toString();
    window.location.href = `${GOOGLE_URI}?${queryString}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError(t('login.errorPasswordMismatch'));
      return;
    }

    try {
      await register(registerData.email, registerData.password, registerData.name, 'shop');
    } catch (err: any) {
      setError(err.message || t('login.errorRegister'));
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center">
            <CircularProgress />
            <Typography sx={{ mt: 2 }} color="text.secondary">
              {t('login.loading')}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        pt: { xs: 6, md: 0 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* HEADER */}
          <Box textAlign="center" mb={4}>
            <Typography fontWeight={800} fontSize={{ xs: 24, md: 28 }}>
              Go2Copy
            </Typography>

            <Typography color="text.secondary" mt={1}>
              {t('login.subtitle')}
            </Typography>
          </Box>

          {/* TABS */}
          <Tabs
            value={tabValue}
            onChange={(_, v) => {
              setTabValue(v);
              setError('');
            }}
            variant="fullWidth"
          >
            <Tab label={t('login.tabLogin')} />
            <Tab label={t('login.tabRegister')} />
          </Tabs>

          <Divider sx={{ my: 2 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* LOGIN */}
          <TabPanel value={tabValue} index={0}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              sx={{ py: 1.2, textTransform: 'none' }}
            >
              {isMobile ? 'Google' : t('login.googleButton')}
            </Button>

            <Divider sx={{ my: 3 }}>{t('login.or')}</Divider>

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label={t('login.emailLabel')}
                type="email"
                margin="normal"
                size="small"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />

              <TextField
                fullWidth
                label={t('login.passwordLabel')}
                type="password"
                margin="normal"
                size="small"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, textTransform: 'none' }}
              >
                {loading ? <CircularProgress size={22} /> : t('login.loginButton')}
              </Button>
            </Box>
          </TabPanel>

          {/* REGISTER */}
          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                fullWidth
                label={t('login.nameLabel')}
                margin="normal"
                size="small"
                required
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
              />

              <TextField
                fullWidth
                label={t('login.emailLabel')}
                type="email"
                margin="normal"
                size="small"
                required
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />

              <TextField
                fullWidth
                label={t('login.passwordLabel')}
                type="password"
                margin="normal"
                size="small"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />

              <TextField
                fullWidth
                label={t('login.confirmPasswordLabel')}
                type="password"
                margin="normal"
                size="small"
                required
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, textTransform: 'none' }}
              >
                {loading ? <CircularProgress size={22} /> : t('login.registerButton')}
              </Button>
            </Box>
          </TabPanel>

          <Box textAlign="center" mt={4}>
            <Link href="/" underline="hover" color="text.secondary">
              {t('login.backToHome')}
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}