"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  AlertTitle,
  LinearProgress,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

interface FileInfo {
  name: string;
  size: number;
  type: string;
  pages?: number;
}

export function FileUploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculationComplete, setCalculationComplete] = useState(false);

  const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
  const maxFileSize = 50 * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return `Nepodržan tip fajla. Dozvoljena su samo: ${allowedTypes.join(", ")}`;
    }
    if (file.size > maxFileSize) {
      return "Fajl je prevelik. Maksimalna veličina je 50MB.";
    }
    return null;
  };

  const estimatePages = (file: File): number => {
    const sizeInKB = file.size / 1024;
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return Math.max(1, Math.round(sizeInKB / 100));
      case "doc":
      case "docx":
        return Math.max(1, Math.round(sizeInKB / 50));
      case "txt":
        return Math.max(1, Math.round(sizeInKB / 5));
      default:
        return 1;
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSelectedFile(file);
    const pages = estimatePages(file);
    setFileInfo({ name: file.name, size: file.size, type: file.type, pages });
    setCalculationComplete(false);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleCalculate = () => {
    if (!selectedFile || !fileInfo) return;
    setIsCalculating(true);
    setError(null);
    setTimeout(() => {
      setIsCalculating(false);
      setCalculationComplete(true);
      window.dispatchEvent(
        new CustomEvent("fileCalculated", {
          detail: {
            file: selectedFile,
            pages: fileInfo.pages,
            estimatedCost: fileInfo.pages! * 10,
          },
        })
      );
    }, 2000);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileInfo(null);
    setCalculationComplete(false);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader
        title="Korak 1: Otpremite fajl"
        subheader="Da biste videli cenu u realnom vremenu, otpremite .pdf, .doc, .docx ili .txt fajl. Maksimalno 50MB."
      />
      <CardContent>
        {error && (
          <Alert severity="error" icon={<AlertCircle size={20} />}>
            <AlertTitle>Greška</AlertTitle>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            {!selectedFile ? (
              <>
                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                  />
                  <Paper
                    elevation={1}
                    sx={{
                      p: 4,
                      textAlign: "center",
                      border: "2px dashed",
                      borderColor: isDragOver ? "primary.main" : "grey.400",
                      cursor: "pointer",
                    }}
                  >
                    <Upload size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="body1" color="primary">
                      Kliknite da izaberete fajl
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ili prevucite fajl ispod
                    </Typography>
                  </Paper>
                </label>

                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 2,
                    textAlign: "center",
                    border: "2px dashed",
                    borderColor: isDragOver ? "primary.main" : "grey.300",
                    backgroundColor: isDragOver ? "action.hover" : "inherit",
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FileText size={24} style={{ marginBottom: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Prevucite i otpustite fajl ovde
                  </Typography>
                </Paper>
              </>
            ) : (
              <Paper sx={{ p: 2, border: "1px solid", borderColor: "primary.main" }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" gap={2}>
                    <Box p={1} bgcolor="primary.light" borderRadius={1}>
                      <FileText size={20} color="primary" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" color="primary">
                        {fileInfo?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Veličina: {fileInfo && formatFileSize(fileInfo.size)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Procenjeno stranica: {fileInfo?.pages}
                      </Typography>
                      {calculationComplete && (
                        <Box display="flex" alignItems="center" gap={1} color="success.main">
                          <CheckCircle size={16} />
                          <Typography variant="body2">Fajl je obrađen</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <IconButton onClick={handleRemoveFile}>
                    <X size={20} />
                  </IconButton>
                </Box>
              </Paper>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCalculate}
                disabled={!selectedFile || isCalculating || calculationComplete}
              >
                {isCalculating ? "Obrađuje..." : calculationComplete ? "Obrađeno" : "Izračunaj cenu"}
              </Button>

              {isCalculating && (
                <>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Analizira se fajl...
                  </Typography>
                  <LinearProgress />
                </>
              )}

              {calculationComplete && (
                <Typography variant="body2" color="success.main" textAlign="center">
                  ✓ Spremno za konfiguraciju
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="caption" color="text.secondary">
            <strong>Podržani formati:</strong> PDF, DOC, DOCX, TXT
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            <strong>Maksimalna veličina:</strong> 50MB po fajlu
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
