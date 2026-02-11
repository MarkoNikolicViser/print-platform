'use client';

import React from 'react';
import { Box, Button, Card, Chip, Stack, Typography, alpha, useTheme } from '@mui/material';
import { ShoppingBag, Sparkles, Plus } from 'lucide-react';

type Props = {
  /** true => no orders exist at all */
  isTrulyEmpty?: boolean;
  /** CTA */
  onPrimaryAction?: () => void;
  /** Optional secondary action */
  onSecondaryAction?: () => void;
};

export function NoOrdersEmptyState({
  isTrulyEmpty = true,
  onPrimaryAction,
  onSecondaryAction,
}: Props) {
  const theme = useTheme();

  const title = isTrulyEmpty ? 'Još nema porudžbina' : 'Nema rezultata';
  const subtitle = isTrulyEmpty
    ? 'Vreme je da pokreneš mašinu 😄 Dodaj proizvode, sredi ponudu i pusti promo — prva porudžbina stiže brzo.'
    : 'Probaj širu pretragu ili drugačiji status.';

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        // BIG hero feel
        minHeight: { xs: 340, sm: 420 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 3, sm: 6 },
        background:
          theme.palette.mode === 'dark'
            ? `radial-gradient(1200px 600px at 10% 0%, ${alpha(
                theme.palette.primary.main,
                0.25,
              )} 0%, transparent 55%),
               radial-gradient(900px 600px at 100% 0%, ${alpha(
                 theme.palette.secondary.main,
                 0.2,
               )} 0%, transparent 60%),
               linear-gradient(180deg, ${alpha('#0b1020', 0.9)} 0%, ${alpha('#0b1020', 0.6)} 100%)`
            : `radial-gradient(1200px 600px at 10% 0%, ${alpha(
                theme.palette.primary.main,
                0.18,
              )} 0%, transparent 55%),
               radial-gradient(900px 600px at 100% 0%, ${alpha(
                 theme.palette.secondary.main,
                 0.14,
               )} 0%, transparent 60%),
               linear-gradient(180deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(
                 theme.palette.background.paper,
                 1,
               )} 100%)`,
      }}
    >
      {/* floating blobs */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '& .blob': {
            position: 'absolute',
            width: { xs: 260, sm: 360 },
            height: { xs: 260, sm: 360 },
            borderRadius: '999px',
            filter: 'blur(28px)',
            opacity: theme.palette.mode === 'dark' ? 0.28 : 0.22,
            animation: 'float 10s ease-in-out infinite',
          },
          '& .a': {
            left: { xs: -120, sm: -160 },
            top: { xs: -140, sm: -180 },
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.95,
            )}, ${alpha(theme.palette.secondary.main, 0.95)})`,
          },
          '& .b': {
            right: { xs: -140, sm: -180 },
            top: { xs: 20, sm: 40 },
            width: { xs: 320, sm: 420 },
            height: { xs: 320, sm: 420 },
            animationDelay: '1.5s',
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.secondary.main,
              0.9,
            )}, ${alpha(theme.palette.success.main, 0.9)})`,
          },
          '& .c': {
            left: '30%',
            bottom: { xs: -220, sm: -260 },
            width: { xs: 360, sm: 520 },
            height: { xs: 360, sm: 520 },
            animationDelay: '2.2s',
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.info.main,
              0.85,
            )}, ${alpha(theme.palette.primary.main, 0.85)})`,
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
            '50%': { transform: 'translate3d(0, -18px, 0) scale(1.05)' },
          },
        }}
      >
        <Box className="blob a" />
        <Box className="blob b" />
        <Box className="blob c" />
      </Box>

      {/* dotted pattern */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: theme.palette.mode === 'dark' ? 0.18 : 0.12,
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          color: theme.palette.mode === 'dark' ? alpha('#fff', 0.45) : alpha('#000', 0.25),
          maskImage: 'radial-gradient(700px 320px at 30% 10%, #000 0%, transparent 70%)',
        }}
      />

      <Stack
        spacing={3}
        alignItems="center"
        textAlign="center"
        sx={{ position: 'relative', maxWidth: 760 }}
      >
        {/* big icon */}
        <Box
          sx={{
            width: { xs: 78, sm: 96 },
            height: { xs: 78, sm: 96 },
            borderRadius: 4,
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.14),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.26)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 14px 40px ${alpha('#000', 0.5)}`
                : `0 14px 40px ${alpha('#000', 0.12)}`,
          }}
        >
          {isTrulyEmpty ? <ShoppingBag size={34} /> : <Sparkles size={34} />}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -0.5 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1.2, opacity: 0.9, fontSize: { xs: 15, sm: 16 } }}>
            {subtitle}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
          <Chip
            icon={<Sparkles size={14} />}
            label="Pro tip: brza obrada = više povratnih kupaca"
            variant="outlined"
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.35),
              borderColor: alpha(theme.palette.primary.main, 0.25),
              backdropFilter: 'blur(6px)',
            }}
          />
          <Chip
            icon={<Sparkles size={14} />}
            label="Dodaj jasne cene i rokove"
            variant="outlined"
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.35),
              borderColor: alpha(theme.palette.primary.main, 0.25),
              backdropFilter: 'blur(6px)',
            }}
          />
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ mt: 1, width: '100%', justifyContent: 'center' }}
        >
          <Button
            size="large"
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={onPrimaryAction}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 900,
              minWidth: { xs: '100%', sm: 220 },
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
            }}
          >
            {isTrulyEmpty ? 'Dodaj proizvod' : 'Promeni kriterijume'}
          </Button>

          {onSecondaryAction && (
            <Button
              size="large"
              variant="outlined"
              onClick={onSecondaryAction}
              sx={{
                px: 3,
                py: 1.2,
                fontWeight: 800,
                minWidth: { xs: '100%', sm: 220 },
                borderColor: alpha(theme.palette.primary.main, 0.35),
                bgcolor: alpha(theme.palette.background.paper, 0.3),
              }}
            >
              Sekundarna akcija
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
