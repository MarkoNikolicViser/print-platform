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
import { API_URL } from '@/helpers/constants';

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
  const { login, register } = useAuth();
  const router = useRouter();

  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);


    try {
      await login(loginData.email, loginData.password);
      router.push('/store');
    } catch (err: any) {
      setError(err.message || 'Greška pri prijavi');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/connect/google`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    setLoading(true);

    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.name,
      );
      router.push('/store');
    } catch (err: any) {
      setError(err.message || 'Greška pri registraciji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            PrintSerbia
          </Typography>
          <Typography color="text.secondary">
            Online štamparija za profesionalce
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(_, v) => {
            setTabValue(v);
            setError('');
          }}
          centered
        >
          <Tab label="Prijava" />
          <Tab label="Registracija" />
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
            size="large"
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            sx={{
              backgroundColor: '#fff',
              color: '#3c4043',
              borderColor: '#dadce0',
              '&:hover': {
                backgroundColor: '#f7f8f8',
              },
            }}
          >
            Nastavi sa Google nalogom
          </Button>

          <Divider sx={{ my: 2 }}>ili</Divider>

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              margin="normal"
              autoComplete="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              required
              margin="normal"
              autoComplete="current-password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 600,
                bgcolor: '#f97316',
                ':hover': { bgcolor: '#ea580c' },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Prijavite se'}
            </Button>
          </Box>
        </TabPanel>

        {/* REGISTER */}
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Ime i prezime"
              required
              margin="normal"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              margin="normal"
              autoComplete="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Lozinka"
              type="password"
              required
              margin="normal"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Potvrdite lozinku"
              type="password"
              required
              margin="normal"
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
              size="large"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 600,
                bgcolor: '#f97316',
                ':hover': { bgcolor: '#ea580c' },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Napravite nalog'}
            </Button>
          </Box>
        </TabPanel>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link href="/" underline="hover">
            ← Nazad na početnu
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
