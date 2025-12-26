"use client"

import type React from "react"
import { useState } from "react"
import { Box, Container, Stepper, Step, StepLabel, Typography } from "@mui/material"
import FileUploadSection from "../components/FileUploadSection"
import PrintConfigSection from "../components/PrintConfigSection"
import ShopSelectionSection from "../components/ShopSelectionSection"
import type { PrintOptions } from "../types"

const steps = ["Upload Fajl", "Konfiguracija Štampe", "Izbor Štamparije"]

const HomePage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [fileData, setFileData] = useState<{
    fileName: string
    fileUrl: string
    fileSize: number
    pageCount: number
  } | null>(null)
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    colorPrinting: false,
    doubleSided: false,
    paperType: "standard",
    binding: "none",
    copies: 1,
  })

  const handleFileUploaded = (uploadedFileData: typeof fileData) => {
    setFileData(uploadedFileData)
    setActiveStep(1)
  }

  const handlePrintConfigComplete = (options: PrintOptions) => {
    setPrintOptions(options)
    setActiveStep(2)
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            mb: 2,
            fontSize: "2.5rem",
            color: "primary.main",
          }}
        >
          PrintSerbia
        </Typography>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 4,
            fontSize: "1.2rem",
            fontWeight: 400,
            color: "text.secondary",
          }}
        >
          Naručite štampanje online - bez čekanja u redu
        </Typography>

        {/* Progress Stepper */}
        <Stepper
          activeStep={activeStep}
          sx={{
            mb: 6,
            "& .MuiStepLabel-label": {
              fontSize: "1rem",
              fontWeight: 600,
            },
            "& .MuiStepIcon-root": {
              fontSize: "2rem",
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ minHeight: "400px" }}>
          {activeStep === 0 && <FileUploadSection onFileUploaded={handleFileUploaded} />}

          {activeStep === 1 && fileData && (
            <PrintConfigSection fileData={fileData} onConfigComplete={handlePrintConfigComplete} onBack={handleBack} />
          )}

          {activeStep === 2 && fileData && printOptions && (
            <ShopSelectionSection fileData={fileData} printOptions={printOptions} onBack={handleBack} />
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default HomePage
