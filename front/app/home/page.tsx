'use client';

import { FileUploadSection } from '@/components/file-upload-section';
import { Header } from '@/components/header';
import { PrintConfigSection } from '@/components/print-config-section';
import { ShopSelectionSection } from '@/components/shop-selection-section';
import { usePrintContext } from '@/context/PrintContext';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();

  const steps = useMemo(
    () => [t('home.steps.upload'), t('home.steps.config'), t('home.steps.location')],
    [t]
  );

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [autoAdvance, setAutoAdvance] = useState(true);

  const { files = [], selectedShop } = usePrintContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleStep = (step: number) => () => {
    // korisnik preuzima kontrolu nad stepom
    setAutoAdvance(false);
    setActiveStep(step);
  };

  /* ================================
     STEP 0 → STEP 1 (Template ready)
  ================================= */
  useEffect(() => {
    if (!files || files.length === 0) {
      setCompleted({});
      setActiveStep(0);
      setAutoAdvance(true);
      return;
    }

    const allHaveTemplate = files.every(file => file.selectedTemplate);

    if (!allHaveTemplate) return;

    setCompleted(prev => ({ ...prev, 0: true }));

    if (autoAdvance) {
      const timer = setTimeout(() => {
        setActiveStep(1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [files, autoAdvance]);

  /* ================================
     STEP 1 → STEP 2 (Shop selected)
  ================================= */
  useEffect(() => {
    if (!selectedShop) return;

    setCompleted(prev => ({ ...prev, 2: true }));

    if (autoAdvance && activeStep === 1) {
      setActiveStep(2);
    }
  }, [selectedShop, autoAdvance, activeStep]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, sm: 3 } }}>
        {/* HERO */}
        <Box textAlign="center" mb={{ xs: 3, sm: 4, md: 6 }} px={{ xs: 2, sm: 0 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h3'}
            fontWeight={800}
            color="primary.main"
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: 1.2 }}
          >
            {t('home.heroTitle')}
          </Typography>

          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }, lineHeight: 1.5 }}
          >
            {t('home.heroSubtitle')}
          </Typography>
        </Box>

        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            {/* STEPPER */}
            <Box sx={{ mb: { xs: 3, md: 5 }, overflowX: 'visible' }}>
              <Stepper
                nonLinear
                activeStep={activeStep}
                alternativeLabel={!isMobile}
                sx={{
                  width: '100%',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
              >
                {steps.map((label, index) => {
                  const isDisabled = !completed[index] && index !== activeStep;

                  return (
                    <Step key={label} completed={completed[index]}>
                      <StepButton
                        onClick={handleStep(index)}
                        disabled={isDisabled}
                        sx={{
                          '& .MuiStepLabel-label': {
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            transition: 'all 0.3s ease',
                            opacity: isDisabled ? 0.4 : 1,
                            color: completed[index]
                              ? 'primary.main'
                              : isDisabled
                                ? 'text.disabled'
                                : 'text.primary',
                            borderBottom: activeStep === index ? '2px solid' : 'none',
                            borderColor: activeStep === index ? 'primary.main' : 'transparent',
                          },
                        }}
                      >
                        {!isMobile && label}
                      </StepButton>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>

            {/* STEP CONTENT */}
            {activeStep === 0 && <FileUploadSection />}

            {activeStep === 1 && (
              <PrintConfigSection
                onNextStep={() => {
                  setCompleted(prev => ({ ...prev, 1: true }));
                  setAutoAdvance(false);
                  setActiveStep(2);
                }}
              />
            )}

            {activeStep === 2 && <ShopSelectionSection />}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}