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
  Chip,
} from "@mui/material";
import { Upload, FileText, AlertCircle, X } from "lucide-react";
import { PrintTypeSelector } from "./print-type-selector";
import { usePrintContext } from "@/context/PrintContext";

interface FileInfo {
  name: string;
  size: number;
  type: string;
  pages?: number;
}

export function FileUploadSection() {
  const { file, setFile } = usePrintContext();
  const [info, setInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const allowedTypes = [".pdf", ".doc", ".docx", ".txt", ".jpg"];
  const maxFileSize = 50 * 1024 * 1024;

  /* ---------------- utils ---------------- */

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      return `Dozvoljeni formati: ${allowedTypes.join(", ")}`;
    }
    if (file.size > maxFileSize) {
      return "Maksimalna veličina fajla je 50MB.";
    }
    return null;
  };

  const estimatePages = (file: File) => {
    const kb = file.size / 1024;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return Math.max(1, Math.round(kb / 100));
    if (ext === "doc" || ext === "docx") return Math.max(1, Math.round(kb / 50));
    if (ext === "txt") return Math.max(1, Math.round(kb / 5));
    return 1;
  };

  const formatSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  /* ---------------- handlers ---------------- */

  const selectFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) return setError(err);

    setError(null);
    setFile(file);
    setInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      pages: estimatePages(file),
    });
    setDone(false);
  }, []);

  const handleCalculate = () => {
    if (!file || !info) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);

      window.dispatchEvent(
        new CustomEvent("fileCalculated", {
          detail: {
            file,
            pages: info.pages,
            estimatedCost: info.pages! * 10,
          },
        })
      );
    }, 1800);
  };

  const reset = () => {
    setFile(null);
    setInfo(null);
    setDone(false);
    setError(null);
  };
  /* ---------------- render ---------------- */

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" color="primary" sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
            1. Otpremanje fajla
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Uploadujte dokument kako bismo izračunali cenu štampe
          </Typography>
        }
      />
      <CardContent>
        {error && (
          <Alert severity="error" icon={<AlertCircle size={20} />}>
            <AlertTitle>Greška</AlertTitle>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* LEFT */}
          <Grid size={{ xs: 12, md: 8 }}>
            {!file ? (
              <label>
                <input
                  hidden
                  type="file"
                  accept={allowedTypes.join(",")}
                  onChange={(e) =>
                    e.target.files && selectFile(e.target.files[0])
                  }
                />

                <Paper
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    selectFile(e.dataTransfer.files[0]);
                  }}
                  sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "2px dashed",
                    borderColor: dragOver ? "primary.main" : "grey.400",
                    bgcolor: dragOver ? "action.hover" : "transparent",
                    cursor: "pointer",
                    transition: "all .2s ease",
                  }}
                >
                  <Upload size={36} />
                  <Typography mt={1} fontWeight={600}>
                    Kliknite ili prevucite fajl
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, DOC, DOCX, TXT • max 50MB
                  </Typography>
                </Paper>
              </label>
            ) : (
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: done ? "success.main" : "divider",
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" gap={2}>
                    <FileText />
                    <Box>
                      <Typography fontWeight={600}>{info?.name}</Typography>
                      <Typography variant="caption">
                        {formatSize(info!.size)} • {info?.pages} stranica
                      </Typography>
                      <Box mt={1}>
                        <Chip
                          size="small"
                          color={done ? "success" : "warning"}
                          label={done ? "Obrađeno" : "Nije obrađeno"}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <IconButton onClick={reset}>
                    <X />
                  </IconButton>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* RIGHT */}
          <Grid size={{ xs: 12, md: 4 }} >
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography
                variant="caption"
                textAlign="center"
                color={
                  done
                    ? "success.main"
                    : file
                      ? "primary.main"
                      : "text.secondary"
                }
              >
                {done
                  ? "Korak 1 završen"
                  : file
                    ? "Spremno za obračun"
                    : "Izaberite fajl"}
              </Typography>

              <Button
                variant="contained"
                onClick={handleCalculate}
                disabled={!file || loading || done}
              >
                {loading
                  ? "Analiza u toku…"
                  : done
                    ? "Cena izračunata"
                    : "Izračunaj cenu"}
              </Button>

              {loading && <LinearProgress />}
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <PrintTypeSelector
            fileUploaded={Boolean(file)}
            documentMime={file?.type}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
