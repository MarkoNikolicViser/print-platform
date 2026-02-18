'use client';

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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type React from 'react';
import { useAuth } from '@/context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_URI,
  STRAPI_REDIRECT_URI,
} from '@/helpers/constants';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

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
      setError(err.message || 'Greška pri prijavi');
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
      app_role: 'shop',
    };

    const queryString = new URLSearchParams(options).toString();
    window.location.href = `${GOOGLE_URI}?${queryString}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.name,
        'shop'
      );
    } catch (err: any) {
      setError(err.message || 'Greška pri registraciji');
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
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0f172a 0%, #111827 40%, #0b1120 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 40%, #f1f5f9 100%)',
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(17,24,39,0.7)'
                : 'rgba(255,255,255,0.7)',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 10px 40px rgba(0,0,0,0.6)'
                : '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <CircularProgress size={40} sx={{ color: '#f97316' }} />
          <Typography
            sx={{ mt: 2, fontSize: '0.9rem', color: 'text.secondary' }}
          >
            Učitavanje...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #111827 40%, #0b1120 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 40%, #f1f5f9 100%)',
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        pt: { xs: 6, md: 0 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            backdropFilter: 'blur(14px)',
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(17,24,39,0.85)'
                : 'rgba(255,255,255,0.75)',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.06)'
                : '1px solid rgba(255,255,255,0.6)',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 10px 40px rgba(0,0,0,0.6)'
                : '0 10px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* HEADER */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: '1.6rem',
                  sm: '1.9rem',
                  md: '2.2rem',
                },
                letterSpacing: '-0.5px',
                color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
              }}
            >
              Go2Copy
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: { xs: '0.85rem', md: '0.95rem' },
              }}
            >
              Profesionalno online štampanje bez čekanja
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
            sx={{
              mb: 1,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 3,
                backgroundColor: '#f97316',
              },
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                color:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.6)'
                    : 'inherit',
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                '&.Mui-selected': {
                  color: theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                },
              },
            }}
          >
            <Tab label="Prijava" />
            <Tab label="Registracija" />
          </Tabs>

          <Divider sx={{ mb: 2, borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : undefined }} />

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
              sx={{
                py: 1.2,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#1f2937' : '#fff',
                borderColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : '#e5e7eb',
                color:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.9)'
                    : 'inherit',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#273549' : '#f9fafb',
                },
              }}
            >
              {isMobile ? 'Google' : 'Nastavi sa Google nalogom'}
            </Button>

            <Divider sx={{ my: 3, borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : undefined }}>ili</Divider>

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                size="small"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.12)'
                        : undefined,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Lozinka"
                type="password"
                margin="normal"
                size="small"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.12)'
                        : undefined,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="small"
                sx={{
                  mt: 3,
                  py: 1.3,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  background:
                    'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #ea580c, #c2410c)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Prijavite se'
                )}
              </Button>
            </Box>
          </TabPanel>

          {/* REGISTER */}
          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Ime i prezime"
                margin="normal"
                required
                size="small"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    name: e.target.value,
                  })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.12)'
                        : undefined,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                size="small"
                required
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value,
                  })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.12)'
                        : undefined,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Lozinka"
                type="password"
                margin="normal"
                size="small"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.12)'
                        : undefined,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Potvrdite lozinku"
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'transparent',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.12)'
                        : undefined,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="small"
                sx={{
                  mt: 3,
                  py: 1.3,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  background:
                    'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 8px 20px rgba(249,115,22,0.3)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #ea580c, #c2410c)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Napravite nalog'
                )}
              </Button>
            </Box>
          </TabPanel>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Link
              href="/"
              underline="hover"
              sx={{
                fontSize: '0.85rem',
                color: 'text.secondary',
              }}
            >
              ← Nazad na početnu
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
