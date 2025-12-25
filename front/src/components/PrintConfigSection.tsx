"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  Divider,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import PrintIcon from "@mui/icons-material/Print"
import ColorLensIcon from "@mui/icons-material/ColorLens"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import BookIcon from "@mui/icons-material/Book"
import type { PrintOptions } from "../types"

interface PrintConfigSectionProps {
  fileData: {
    fileName: string
    fileUrl: string
    fileSize: number
    pageCount: number
  }
  onConfigComplete: (options: PrintOptions) => void
  onBack: () => void
}

const PrintConfigSection: React.FC<PrintConfigSectionProps> = ({ fileData, onConfigComplete, onBack }) => {
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    colorPrinting: false,
    doubleSided: false,
    paperType: "standard",
    binding: "none",
    copies: 1,
  })

  const handleOptionChange = (key: keyof PrintOptions, value: any) => {
    setPrintOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleContinue = () => {
    onConfigComplete(printOptions)
  }

  const estimatedCost = calculateEstimatedCost()

  function calculateEstimatedCost(): number {
    // Base prices (these would come from selected shop in real app)
    const baseBlackWhite = 5 // RSD per page
    const baseColor = 15 // RSD per page
    const paperMultipliers = { standard: 1, premium: 1.5, photo: 2 }
    const bindingCosts = { none: 0, staple: 20, spiral: 50, hardcover: 150 }

    let cost = printOptions.colorPrinting ? baseColor : baseBlackWhite
    cost *= fileData.pageCount
    cost *= printOptions.copies
    cost *= paperMultipliers[printOptions.paperType]

    if (printOptions.doubleSided) {
      cost *= 0.8 // 20% discount for double-sided
    }

    cost += bindingCosts[printOptions.binding]

    return Math.round(cost)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        border: "3px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 2,
          fontSize: "1.5rem",
          color: "primary.main",
          fontWeight: 700,
        }}
      >
        KORAK 2: KONFIGURACIJA ŠTAMPE
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.primary" }}>
        Izaberite opcije štampe za vaš fajl: <strong>{fileData.fileName}</strong>
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Configuration Options */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Color vs Black & White */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: printOptions.colorPrinting ? "secondary.main" : "primary.main",
                  backgroundColor: printOptions.colorPrinting ? "rgba(249, 115, 22, 0.05)" : "transparent",
                }}
              >
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ColorLensIcon />
                      Tip štampe
                    </FormLabel>
                    <RadioGroup
                      value={printOptions.colorPrinting ? "color" : "blackwhite"}
                      onChange={(e) => handleOptionChange("colorPrinting", e.target.value === "color")}
                    >
                      <FormControlLabel
                        value="blackwhite"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Crno-belo
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              5 RSD po strani
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="color"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              U boji
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              15 RSD po strani
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Double-sided */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: printOptions.doubleSided ? "secondary.main" : "primary.main",
                  backgroundColor: printOptions.doubleSided ? "rgba(249, 115, 22, 0.05)" : "transparent",
                }}
              >
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <FileCopyIcon />
                      Strane
                    </FormLabel>
                    <RadioGroup
                      value={printOptions.doubleSided ? "double" : "single"}
                      onChange={(e) => handleOptionChange("doubleSided", e.target.value === "double")}
                    >
                      <FormControlLabel
                        value="single"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Jednostrano
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Standardno
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="double"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Dvostrano
                            </Typography>
                            <Typography variant="body2" sx={{ color: "success.main" }}>
                              20% popust
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Paper Type */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              >
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <PrintIcon />
                      Tip papira
                    </FormLabel>
                    <RadioGroup
                      value={printOptions.paperType}
                      onChange={(e) => handleOptionChange("paperType", e.target.value)}
                    >
                      <FormControlLabel
                        value="standard"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Standardni (80g)
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Osnovni papir
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="premium"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Premium (120g)
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              +50% cena
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="photo"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Foto papir
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              +100% cena
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Binding */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              >
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <BookIcon />
                      Povezivanje
                    </FormLabel>
                    <RadioGroup
                      value={printOptions.binding}
                      onChange={(e) => handleOptionChange("binding", e.target.value)}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Bez povezivanja
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Besplatno
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="staple"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Heftalica
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              +20 RSD
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="spiral"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Spirala
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              +50 RSD
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="hardcover"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Tvrdi povez
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              +150 RSD
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Number of Copies */}
            <Grid item xs={12}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Broj kopija
                  </Typography>
                  <TextField
                    type="number"
                    value={printOptions.copies}
                    onChange={(e) => handleOptionChange("copies", Math.max(1, Number.parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, max: 100 }}
                    sx={{ width: 120 }}
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                    Maksimalno 100 kopija po narudžbi
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Summary */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              border: "3px solid",
              borderColor: "secondary.main",
              backgroundColor: "rgba(249, 115, 22, 0.05)",
              position: "sticky",
              top: 20,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  color: "secondary.main",
                  fontWeight: 700,
                  mb: 2,
                  textAlign: "center",
                }}
              >
                PREGLED NARUDŽBE
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Fajl:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                  {fileData.fileName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Broj strana:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {fileData.pageCount}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Opcije:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                  <Chip
                    label={printOptions.colorPrinting ? "U boji" : "Crno-belo"}
                    size="small"
                    color={printOptions.colorPrinting ? "secondary" : "default"}
                  />
                  <Chip
                    label={printOptions.doubleSided ? "Dvostrano" : "Jednostrano"}
                    size="small"
                    variant="outlined"
                  />
                  <Chip label={`${printOptions.paperType} papir`} size="small" variant="outlined" />
                  {printOptions.binding !== "none" && (
                    <Chip label={printOptions.binding} size="small" variant="outlined" />
                  )}
                  <Chip label={`${printOptions.copies} kopija`} size="small" variant="outlined" />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Procenjena cena:
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 700,
                  }}
                >
                  {estimatedCost} RSD
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                  *Finalna cena zavisi od izabrane štamparije
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            px: 3,
            py: 1.5,
          }}
        >
          Nazad
        </Button>

        <Button
          variant="contained"
          color="secondary"
          endIcon={<ArrowForwardIcon />}
          onClick={handleContinue}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          Nastavi na izbor štamparije
        </Button>
      </Box>
    </Paper>
  )
}

export default PrintConfigSection
