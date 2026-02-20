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
  Paper,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import { Upload, FileText, AlertCircle, X, ShieldCheck } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PrintTypeSelector } from './print-type-selector';
import { allowedFileTypes } from '@/hooks/useFileUpload';
import { useFileUpload } from '@/hooks/useFileUpload';
import { PreviewModal } from './PreviewRenderer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { isItImage } from '@/helpers/formatters';

export function FileUploadSection() {
  const {
    file,
    setFile,
    fileInfo,
    setFileInfo,
    done,
    setDone,
    uploadedUrl,
    setUploadedUrl,
    previewOpen,
    setPreviewOpen,
  } = usePrintContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
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

      setFile(file);
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      try {
        const res = await uploadFile(file);

        if (!res.success) {
          throw new Error(res.error || 'Greška pri otpremanju.');
        }

        setFileInfo((prev) =>
          prev
            ? {
              ...prev,
              pages: res.pageCount,
              url: res.url,
            }
            : prev,
        );

        if (res.url) setUploadedUrl(res.url);

        setDone(true);

      } catch (e: any) {
        setError(e?.message || 'Greška pri otpremanju.');
        setFile(null);
        setFileInfo(null);
        setDone(false);
        setUploadedUrl(null);
      }
    },
    [uploadFile, setFile, setFileInfo, setDone, setUploadedUrl],
  );

  const reset = () => {
    if (uploading) return;
    setFile(null);
    setFileInfo(null);
    setDone(false);
    setError(null);
    setUploadedUrl(null);
  };

  return (
    <Card elevation={isMobile ? 4 : 0} sx={{ borderRadius: 3, boxShadow: 'none' }}>
      <CardHeader title={
        <Typography variant="h6" align="center"
          sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' }, }} >
          Bezbedan upload dokumenta
        </Typography>} />

      <CardContent>

        {error && (
          <Alert severity="error" icon={<AlertCircle size={18} />} sx={{ mb: 3 }}>
            <AlertTitle>Greška</AlertTitle>
            {error}
          </Alert>
        )}

        {!file ? (
          <label>
            <input
              hidden
              type="file"
              accept={allowedFileTypes.join(',')}
              disabled={uploading}
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
                const dropped = e.dataTransfer.files?.[0];
                if (dropped) void selectFile(dropped);
              }}
              sx={{
                p: { xs: 3, sm: 6 },
                textAlign: 'center',
                borderRadius: 3,
                border: '2px dashed',
                borderColor: dragOver ? 'primary.main' : 'divider',
                bgcolor: dragOver ? 'action.hover' : 'background.default',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? (
                <>
                  <CircularProgress size={26} />
                  <Typography mt={2} fontWeight={600}>
                    Otpremanje...
                  </Typography>
                </>
              ) : (
                <>
                  <Upload size={isMobile ? 28 : 40} />
                  <Typography mt={2} fontWeight={700}>
                    Kliknite ili prevucite fajl
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    {allowedFileTypes.join(', ').toUpperCase()} • max 50MB
                  </Typography>
                </>
              )}
            </Paper>
          </label>
        ) : (
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: done ? 'primary.main' : 'divider',
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              {/* File info */}
              <Box display="flex" gap={2} width="100%">
                <FileText size={isMobile ? 20 : 24} />

                <Box flex={1}>
                  <Typography
                    fontWeight={700}
                    fontSize={{ xs: '0.9rem', sm: '1rem' }}
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {fileInfo?.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {fileInfo?.size
                      ? formatSize(fileInfo.size)
                      : null}
                    {fileInfo?.pages &&
                      !isItImage(fileInfo?.type)
                      ? ` • ${fileInfo.pages} stranica`
                      : null}
                  </Typography>

                  <Box
                    mt={2}
                    display="flex"
                    gap={1}
                    flexWrap="wrap"
                  >
                    {uploading && (
                      <Chip
                        size="small"
                        color="info"
                        label="Otpremanje..."
                      />
                    )}
                    {uploadedUrl && (
                      <Chip
                        size="small"
                        color="primary"
                        label="Otpremljeno"
                      />
                    )}
                    <Chip
                      size="small"
                      color={done ? 'success' : 'warning'}
                      label={
                        done ? 'Obrađeno' : 'Nije obrađeno'
                      }
                    />
                    <Chip
                      size="small"
                      icon={<VisibilityIcon />}
                      label="Pregled"
                      disabled={!done}
                      onClick={() => setPreviewOpen(true)}
                    />
                  </Box>
                </Box>
              </Box>
              <IconButton
                onClick={reset}
                disabled={uploading}
                sx={{
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>
          </Paper>
        )}

        {/* SECURITY BOX */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            bgcolor: 'success.lighter',
            border: '1px solid',
            borderColor: 'success.light',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ShieldCheck size={18} />
            <Typography fontWeight={700}>
              Vaš dokument je zaštićen
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Typography variant="body2">
            Dokument je vidljiv samo izabranoj kopirnici i briše se nakon završetka štampe.
          </Typography>
        </Paper>

        <Box mt={{ xs: 3, md: 4 }}>
          <PrintTypeSelector
            fileUploaded={done}
            uploading={uploading}
            documentMime={file?.type}
          />
        </Box>

        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          printType={fileInfo?.type ?? 'application/pdf'}
          fileUrl={fileInfo?.url ?? ''}
        />
      </CardContent>
    </Card>
  );
}
