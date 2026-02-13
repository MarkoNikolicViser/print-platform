'use client';

import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import {
  MapPin,
  CreditCard,
  Bell,
  Upload,
  Settings,
  Package,
  ArrowRight,
  Printer,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();

  const handleHomeRedirect = () => router.push('/home');
  const handleStoreRedirect = () => router.push('/store');

  const features = [
    {
      icon: MapPin,
      title: 'Pronađi kopirnice',
      description: 'Locirajte najbliže kopirnice pomoću naše napredne geolokacije.',
    },
    {
      icon: CreditCard,
      title: 'Plati onlajn',
      description: 'Sigurna i trenutna plaćanja. Bez keša, samo klikni i plati.',
    },
    {
      icon: Bell,
      title: 'Obaveštenja uživo',
      description: 'Dobijajte obaveštenja u realnom vremenu kada je vaša štampa spremna.',
    },
    {
      icon: Upload,
      title: 'Brzo otpremanje',
      description: 'Otpremite dokumente sigurno i brzo sa našom platformom.',
    },
  ];

  const steps = [
    { icon: Upload, title: 'Okačite dokument', description: 'Otpremite dokumente online' },
    { icon: Settings, title: 'Izaberite opcije', description: 'Podesite parametre štampe' },
    { icon: CreditCard, title: 'Platite karticom', description: 'Brzo i sigurno plaćanje' },
    { icon: Package, title: 'Preuzmite štampu', description: 'Gotovo bez čekanja' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', color: '#020617' }}>
      {/* AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.85)',
          borderBottom: '1px solid #e5e7eb',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ height: 64 }}>
          <Container
            maxWidth="lg"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Printer size={20} color={theme.palette.primary.main} />
              <Typography sx={{ fontWeight: 800 }}>PrintGo</Typography>
            </Stack>

            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {['Kako radi', 'Pogodnosti', 'Kontakt'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{ color: '#475569', '&:hover': { color: '#020617' } }}
                >
                  {item}
                </Link>
              ))}
            </Stack>

            <Button onClick={handleStoreRedirect} variant="contained">
              Započni
            </Button>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box component="section" sx={{ bgcolor: '#ffffff' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, lg: 6 }}>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.05,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                }}
              >
                Štampanje{' '}
                <Box component="span" sx={{ color: theme.palette.primary.main }}>
                  bez čekanja u redu
                </Box>
              </Typography>

              <Typography sx={{ color: '#475569', mt: 3, maxWidth: 520 }}>
                Okačite dokument online, izaberite tip štampe i preuzmite kada je gotovo.
              </Typography>

              <Button
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                sx={{ mt: 4 }}
                size="large"
                component={Link}
                onClick={handleHomeRedirect}
              >
                Započni štampanje
              </Button>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ position: 'relative', height: 480 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle, ${theme.palette.primary.main}33, transparent 70%)`,
                    filter: 'blur(40px)',
                  }}
                />
                <Image src="/hero-image.png" alt="Print hero" fill className="object-contain" />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics */}
      <Box sx={{ bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} textAlign="center">
            {[
              ['50+', 'Kopirnica'],
              ['2min', 'Prosečno vreme'],
              ['24/7', 'Dostupnost'],
            ].map(([value, label]) => (
              <Grid key={label} size={{ xs: 12, md: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {value}
                </Typography>
                <Typography sx={{ color: '#64748b' }}>{label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ bgcolor: '#ffffff' }}>
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 6 }}>
            Funkcionalnosti platforme
          </Typography>

          <Grid container spacing={4}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(2,6,23,0.06)',
                    }}
                  >
                    <CardContent>
                      <Icon size={24} color={theme.palette.primary.main} />
                      <Typography sx={{ fontWeight: 700, mt: 2 }}>{f.title}</Typography>
                      <Typography sx={{ color: '#475569', mt: 1 }}>{f.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 6 }}>
            Kako funkcioniše
          </Typography>

          <Grid container spacing={4}>
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Grid key={i} size={{ xs: 12, md: 3 }}>
                  <Stack alignItems="center" textAlign="center" spacing={2}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: `${theme.palette.primary.main}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={24} color={theme.palette.primary.main} />
                    </Box>
                    <Typography fontWeight={700}>{s.title}</Typography>
                    <Typography sx={{ color: '#64748b' }}>{s.description}</Typography>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" id="kontakt" sx={{ bgcolor: '#020617', color: '#e5e7eb', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Proizvod</Typography>
              <Stack spacing={1}>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Funkcionalnosti
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Cene
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  FAQ
                </Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Kompanija</Typography>
              <Stack spacing={1}>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  O nama
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Blog
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Karijera
                </Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Podrška</Typography>
              <Stack spacing={1}>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Kontakt
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Dokumentacija
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Status
                </Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Pravno</Typography>
              <Stack spacing={1}>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Privatnost
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Uslovi
                </Link>
                <Link href="#" underline="none" sx={{ color: '#cbd5f5' }}>
                  Kolačići
                </Link>
              </Stack>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              pt: 3,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Printer size={16} />
              <Typography sx={{ fontSize: 14, color: '#cbd5f5' }}>
                © 2026 PrintGo. Sva prava zadržana.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Link href="#" sx={{ color: '#cbd5f5', '&:hover': { color: '#ffffff' } }}>
                <Facebook size={18} />
              </Link>
              <Link href="#" sx={{ color: '#cbd5f5', '&:hover': { color: '#ffffff' } }}>
                <Twitter size={18} />
              </Link>
              <Link href="#" sx={{ color: '#cbd5f5', '&:hover': { color: '#ffffff' } }}>
                <Instagram size={18} />
              </Link>
              <Link href="#" sx={{ color: '#cbd5f5', '&:hover': { color: '#ffffff' } }}>
                <Linkedin size={18} />
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
