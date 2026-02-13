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

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  // Automatski markiraj stepove i prelazak
  useEffect(() => {
    if (!selectedTemplate) return;

    // Obeleži prve dve kao completed
    setCompleted({ 0: true, 1: true });

    // Delay pre prelaska na sledeći step
    const timer = setTimeout(() => {
      setActiveStep(1);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedTemplate]);

  useEffect(() => {
    if (!selectedShop) {
      return
    }
    setCompleted(prev => { return { ...prev, 2: true } })
  }, [selectedShop])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            fontWeight={800}
            color="primary.main"
            gutterBottom
          >
            Štampanje bez čekanja u redu
          </Typography>
          <Typography color="text.secondary">
            Otpremite fajlove, platite online i pokupite gotove kopije
          </Typography>
        </Box>

        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Stepper */}
            <Stepper
              nonLinear
              activeStep={activeStep}
              alternativeLabel
              sx={{ mb: 5 }}
            >
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton
                    onClick={handleStep(index)}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        transition: 'all 0.4s ease',
                        opacity: completed[index] ? 1 : 0.7,
                        color: completed[index] ? 'primary.main' : 'text.primary',
                        borderBottom: activeStep === index ? '2px solid' : 'none',
                        borderColor: activeStep === index ? 'primary.main' : 'transparent',
                      },

                    }}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>

            {/* Step content sa fade-in animacijom */}
            <Box
              sx={{
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                opacity: activeStep === 0 ? 1 : 0,
                transform: activeStep === 0 ? 'translateY(0)' : 'translateY(10px)',
                mb: 2,
              }}
            >
              {activeStep === 0 && <FileUploadSection />}
            </Box>

            <Box
              sx={{
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                opacity: activeStep === 1 ? 1 : 0,
                transform: activeStep === 1 ? 'translateY(0)' : 'translateY(10px)',
                mb: 2,
              }}
            >
              {activeStep === 1 && <PrintConfigSection onNextStep={() => setActiveStep((prev) => prev + 1)} />
              }
            </Box>

            <Box
              sx={{
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                opacity: activeStep === 2 ? 1 : 0,
                transform: activeStep === 2 ? 'translateY(0)' : 'translateY(10px)',
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
