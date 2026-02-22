'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  Upload,
  Settings,
  Package,
  ArrowRight,
  Printer,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/globals.css';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { alpha } from '@mui/material/styles';

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const handleHomeRedirect = () => router.push('/home');
  const handleStoreRedirect = () => router.push('/store');

  const navItems = [
    { label: t('landing.header.nav.howItWorks'), id: 'kako-radi' },
    { label: t('landing.header.nav.benefits'), id: 'pogodnosti' },
    { label: t('landing.header.nav.contact'), id: 'kontakt' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ height: 72 }}>
          <Container
            maxWidth="lg"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Printer size={24} color={theme.palette.primary.main} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                Go2Copy
              </Typography>
            </Stack>

            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  underline="none"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.925rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <LanguageSwitcher />
              <Button
                onClick={handleStoreRedirect}
                variant="contained"
                sx={{
                  borderRadius: '8px',
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {t('landing.header.startButton')}
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box
        component="section"
        sx={{
          pt: { xs: 4, md: 8 },
          background: (theme) =>
            theme.palette.mode === 'light'
              ? `radial-gradient(circle at 20% 0%, rgba(37,99,235,0.08), transparent 40%)`
              : `radial-gradient(circle at 20% 0%, rgba(59,130,246,0.18), transparent 50%)`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, lg: 6 }}>
              <Typography
                component="h1"
                variant="h1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.1,
                  fontSize: { xs: '2.75rem', md: '4rem', lg: '4.5rem' },
                  letterSpacing: '-0.04em',
                }}
              >
                {t('landing.hero.title1')}{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {t('landing.hero.title2')}
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mt: 3,
                  maxWidth: 520,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                {t('landing.hero.description')}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowRight size={18} />}
                  size="large"
                  onClick={handleHomeRedirect}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    boxShadow: (theme) => `0 10px 20px ${theme.palette.primary.main}33`,
                  }}
                >
                  {t('landing.hero.startPrintButton')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="#kako-radi"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    color: 'text.primary',
                    borderColor: 'divider',
                  }}
                >
                  {t('landing.hero.learnMoreButton')}
                </Button>
              </Stack>
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
      <Box sx={{ bgcolor: 'background.paper', borderY: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4} textAlign="center">
            {[
              [t('landing.stats.value1'), t('landing.stats.label1')],
              [t('landing.stats.value2'), t('landing.stats.label2')],
              [t('landing.stats.value3'), t('landing.stats.label3')],
            ].map(([value, label]) => (
              <Grid key={label} size={{ xs: 12, md: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
                  {value}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        component="section"
        id="kako-radi"
        sx={{
          bgcolor: 'background.default',
          py: 14,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ mb: 10, textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.25rem', md: '3rem' },
                letterSpacing: '-0.03em',
              }}
            >
              {t('landing.howItWorks.title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              {t('landing.howItWorks.subtitle')}
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {[
              {
                icon: Upload,
                title: t('landing.howItWorks.step1Title'),
                desc: t('landing.howItWorks.step1Desc'),
              },
              {
                icon: Settings,
                title: t('landing.howItWorks.step2Title'),
                desc: t('landing.howItWorks.step2Desc'),
              },
              {
                icon: CreditCard,
                title: t('landing.howItWorks.step3Title'),
                desc: t('landing.howItWorks.step3Desc'),
              },
              {
                icon: Package,
                title: t('landing.howItWorks.step4Title'),
                desc: t('landing.howItWorks.step4Desc'),
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <Grid key={step.title} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: 'white',
                      }}
                    >
                      <Icon size={24} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontSize: '1.15rem' }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {step.desc}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      <Box
        component="section"
        id="pogodnosti"
        sx={{
          bgcolor: 'background.default',
          scrollMarginTop: '72px',
          py: 14,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, lg: 5 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', md: '3rem' },
                  letterSpacing: '-0.03em',
                  mb: 3,
                }}
              >
                {t('landing.benefits.title')}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, fontWeight: 400 }}>
                {t('landing.benefits.subtitle')}
              </Typography>

              <Stack spacing={4}>
                {[
                  {
                    title: t('landing.benefits.point1Title'),
                    desc: t('landing.benefits.point1Desc'),
                  },
                  {
                    title: t('landing.benefits.point2Title'),
                    desc: t('landing.benefits.point2Desc'),
                  },
                  {
                    title: t('landing.benefits.point3Title'),
                    desc: t('landing.benefits.point3Desc'),
                  },
                ].map((item) => (
                  <Stack key={item.title} direction="row" spacing={3}>
                    <Box sx={{ mt: 0.5 }}>
                      <Box
                        sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Box
                sx={{
                  bgcolor: 'background.default',
                  borderRadius: 6,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'light'
                      ? '0 20px 40px rgba(0,0,0,0.05)'
                      : '0 20px 40px rgba(0,0,0,0.6)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 300, md: 500 },
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Image src="/hero-image.png" alt="Benefits" fill className="object-cover" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        component="section"
        id="kontakt"
        sx={{
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider',
          scrollMarginTop: '72px',
          py: 14,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={2} sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '3rem' },
                letterSpacing: '-0.03em',
              }}
            >
              {t('landing.contact.title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '1.125rem' }}
            >
              {t('landing.contact.subtitle')}
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                      {t('landing.contact.emailLabel')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      support@go2copy.rs
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                      {t('landing.contact.phoneLabel')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      +381 60 123 4567
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                      {t('landing.contact.hoursLabel')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {t('landing.contact.hoursValue')}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                  {t('landing.contact.quickInquiryTitle')}
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('landing.contact.quickInquiryDesc')}
                  </Typography>
                  <Button
                    onClick={() => router.push('/quick-inquiry')}
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    {t('landing.contact.quickInquiryButton')}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'common.black', color: 'grey.300', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} sx={{ mb: 8 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Printer size={24} color={theme.palette.primary.main} />
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>
                  Go2Copy
                </Typography>
              </Stack>
              <Typography sx={{ color: 'grey.500', lineHeight: 1.8, maxWidth: 300 }}>
                {t('footer.description')}
              </Typography>
            </Grid>

            {[
              {
                title: t('footer.product.title'),
                links: [
                  t('footer.product.features'),
                  t('footer.product.pricing'),
                  t('footer.product.faq'),
                ],
              },
              {
                title: t('footer.company.title'),
                links: [
                  t('footer.company.about'),
                  t('footer.company.blog'),
                  t('footer.company.careers'),
                ],
              },
              {
                title: t('footer.support.title'),
                links: [
                  t('footer.support.contact'),
                  t('footer.support.status'),
                  t('footer.support.privacy'),
                ],
              },
            ].map((section) => (
              <Grid key={section.title} size={{ xs: 6, md: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: 'white',
                    mb: 3,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {section.title}
                </Typography>
                <Stack spacing={1.5}>
                  {section.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      underline="none"
                      sx={{
                        color: 'grey.500',
                        fontSize: '0.95rem',
                        Transition: 'color 0.2s',
                        '&:hover': { color: 'white' },
                      }}
                    >
                      {link}
                    </Link>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
              pt: 4,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography sx={{ fontSize: 14, color: 'grey.600' }}>
              {t('footer.copyright')}
            </Typography>

            <Stack direction="row" spacing={3}>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  sx={{
                    color: 'grey.600',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
