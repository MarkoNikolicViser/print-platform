'use client';

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
import { useEffect, useState } from 'react';

import { FileUploadSection } from '@/components/file-upload-section';
import { Header } from '@/components/header';
import { PrintConfigSection } from '@/components/print-config-section';
import { ShopSelectionSection } from '@/components/shop-selection-section';
import { usePrintContext } from '@/context/PrintContext';

const steps = [
  'Otpremanje fajla',
  'Podešavanje štampe',
  'Izbor lokacije',
];

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const { selectedTemplate, selectedShop } = usePrintContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  useEffect(() => {
    if (!selectedTemplate) return;

    setCompleted({ 0: true });

    const timer = setTimeout(() => {
      setActiveStep(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedTemplate]);

  useEffect(() => {
    if (!selectedShop) return;
    setCompleted((prev) => ({ ...prev, 2: true }));
  }, [selectedShop]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Container
        maxWidth="md"
        sx={{
          py: { xs: 3, md: 6 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Hero */}
        <Box
          textAlign="center"
          mb={{ xs: 3, sm: 4, md: 6 }}
          px={{ xs: 2, sm: 0 }} // padding horizontal za mobile
        >
          <Typography
            variant={isMobile ? 'h6' : 'h3'}
            fontWeight={800}
            color="primary.main"
            gutterBottom
            sx={{
              fontSize: {
                xs: '1.5rem', // mobile
                sm: '2rem',   // small tablets
                md: '2.5rem', // desktop
              },
              lineHeight: 1.2,
            }}
          >
            Štampanje bez čekanja
          </Typography>

          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: {
                xs: '0.85rem',
                sm: '0.95rem',
                md: '1rem',
              },
              lineHeight: 1.5,
            }}
          >
            Otpremite fajlove, platite online i pokupite kopije
          </Typography>
        </Box>


        <Card
          elevation={isMobile ? 2 : 4}
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, md: 4 },
            }}
          >
            {/* Stepper */}
            <Box
              sx={{
                mb: { xs: 3, md: 5 },
                overflowX: 'visible', // no forced scroll
              }}
            >
              <Stepper
                nonLinear
                activeStep={activeStep}
                alternativeLabel={!isMobile}
                sx={{
                  width: '100%',
                  flexWrap: isMobile ? 'wrap' : 'nowrap', // wrap steps on mobile
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
                            borderBottom:
                              activeStep === index ? '2px solid' : 'none',
                            borderColor:
                              activeStep === index ? 'primary.main' : 'transparent',
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

            {/* Step content */}
            <Box
              sx={{
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                opacity: activeStep === 0 ? 1 : 0,
                transform:
                  activeStep === 0
                    ? 'translateY(0)'
                    : 'translateY(10px)',
                mb: 2,
              }}
            >
              {activeStep === 0 && <FileUploadSection />}
            </Box>

            <Box
              sx={{
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                opacity: activeStep === 1 ? 1 : 0,
                transform:
                  activeStep === 1
                    ? 'translateY(0)'
                    : 'translateY(10px)',
                mb: 2,
              }}
            >
              {activeStep === 1 && (
                <PrintConfigSection
                  onNextStep={() => {
                    setActiveStep((prev) => prev + 1);
                    setCompleted((prev) => ({
                      ...prev,
                      1: true,
                    }));
                  }}
                />
              )}
            </Box>
            <Box
              sx={{
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                opacity: activeStep === 2 ? 1 : 0,
                transform:
                  activeStep === 2
                    ? 'translateY(0)'
                    : 'translateY(10px)',
              }}
            >
              {activeStep === 2 && <ShopSelectionSection />}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
