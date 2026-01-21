'use client';

import { usePrintContext } from '@/context/PrintContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Alert,
  AlertTitle,
  IconButton,
  Grid,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Upload, FileText, AlertCircle, X } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { PrintTypeSelector } from './print-type-selector';
import { allowedFileTypes } from '@/hooks/useFileUpload';
import { useFileUpload } from '@/hooks/useFileUpload';

export function FileUploadSection() {
  const { file, setFile, fileInfo, setFileInfo } = usePrintContext();

  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const { uploadFile, loading: uploading } = useFileUpload();
  const maxFileSize = 50 * 1024 * 1024;


  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedFileTypes.includes(ext)) {
      return `Dozvoljeni formati: ${allowedFileTypes.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return 'Maksimalna veličina fajla je 50MB.';
    }
    return null;
  };

  const estimatePages = (file: File) => {
    const kb = file.size / 1024;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return Math.max(1, Math.round(kb / 100));
    if (ext === 'doc' || ext === 'docx') return Math.max(1, Math.round(kb / 50));
    if (ext === 'txt') return Math.max(1, Math.round(kb / 5));
    return 1;
  };

  const formatSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const selectFile = useCallback(
    async (file: File) => {
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }

      setError(null);
      setDone(false);
      setUploadedUrl(null);

      // optimistic info + context
      setFile(file);
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        pages: estimatePages(file),
      });

      try {
        const res = await uploadFile(file);
        if (!res.success) {
          setUploadedUrl(null);
          setError(res.error || 'Greška pri otpremanju.');
          setFile(null);
          setFileInfo(null);
          return;
        }
        const finalPages = res.pageCount ?? estimatePages(file);
        const url = res.url ?? ''

        setFileInfo((prev) => (prev ? { ...prev, pages: finalPages, url } : prev));
        if (res.url) {
          setUploadedUrl(res.url);
        }

        const estimatedCost = (finalPages || 1) * 10; // your current pricing logic
        setDone(true);

        window.dispatchEvent(
          new CustomEvent('fileCalculated', {
            detail: {
              file,
              pages: finalPages,
              estimatedCost,
              url: res.url,
            },
          }),
        );

        // Optional: also notify upload completion listeners
        window.dispatchEvent(
          new CustomEvent('fileUploaded', {
            detail: {
              url: res.url,
              name: file.name,
              type: file.type,
              size: file.size,
              pageCount: res.pageCount,
            },
          }),
        );
      } catch (e: any) {
        setUploadedUrl(null);
        setError(e?.message || 'Greška pri otpremanju.');
        setFile(null);
        setFileInfo(null);
      }
    },
    [setFile, uploadFile],
  );

  const reset = () => {
    setFile(null);
    setFileInfo(null);
    setDone(false);
    setError(null);
    setUploadedUrl(null);
  };


  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            color="primary"
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            1. Otpremanje fajla
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Uploadujte dokument – procena cene će biti automatski izračunata
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
          <Grid size={{ xs: 12, md: 16 }}>
            {!file ? (
              <label>
                <input
                  hidden
                  type="file"
                  accept={allowedFileTypes.join(',')}
                  disabled={uploading}
                  onChange={(e) => e.target.files && selectFile(e.target.files[0])}
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
                    const dropped = e.dataTransfer.files?.[0];
                    if (dropped) void selectFile(dropped);
                  }}
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: dragOver ? 'primary.main' : 'grey.400',
                    bgcolor: dragOver ? 'action.hover' : 'transparent',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'all .2s ease',
                    position: 'relative',
                  }}
                >
                  {uploading ? (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <CircularProgress size={28} />
                      <Typography mt={1} fontWeight={600}>
                        Otpremanje u toku...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ne zatvarajte prozor dok se ne završi.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Upload size={36} />
                      <Typography mt={1} fontWeight={600}>
                        Kliknite ili prevucite fajl
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {allowedFileTypes.join(', ').toUpperCase()} • max 50MB
                      </Typography>
                    </>
                  )}
                </Paper>
              </label>
            ) : (
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: done ? 'success.main' : 'divider',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap={2} alignItems="center">
                    <FileText />
                    <Box>
                      <Typography fontWeight={600}>{fileInfo?.name}</Typography>
                      <Typography variant="caption">
                        {formatSize(fileInfo!.size)} • {fileInfo?.pages} stranica
                      </Typography>
                      <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                        {uploading ? (
                          <Chip
                            size="small"
                            color="info"
                            variant="outlined"
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={12} />
                                <span>Otpremanje...</span>
                              </Box>
                            }
                          />
                        ) : uploadedUrl ? (
                          <Chip
                            size="small"
                            color="primary"
                            variant="outlined"
                            label="Otpremljeno"
                          />
                        ) : (
                          <Chip
                            size="small"
                            color="warning"
                            variant="outlined"
                            label="Nije otpremljeno"
                          />
                        )}

                        <Chip
                          size="small"
                          color={done ? 'success' : 'warning'}
                          label={done ? 'Obrađeno' : 'Nije obrađeno'}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <IconButton onClick={reset} disabled={uploading}>
                    <X />
                  </IconButton>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Box mt={4}>
          <PrintTypeSelector fileUploaded={Boolean(file)} documentMime={file?.type} />
        </Box>
      </CardContent>
    </Card>
  );
}
