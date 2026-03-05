'use client';

import { usePrintContext } from '@/context/PrintContext';
import { isItImage } from '@/helpers/formatters';
import { allowedFileTypes } from '@/hooks/useFileUpload';
import { useFileUpload } from '@/hooks/useFileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
  Collapse,
  Alert,
} from '@mui/material';
import { Upload, FileText, X, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PreviewModal } from './PreviewRenderer';
import { MultiFilePrintTypeSelector } from './multi-file-print-type-selector';

export function FileUploadSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { uploadFile } = useFileUpload();

  const {
    files = [],
    setFiles,
    removeFile,
    previewFileId,
    setPreviewFileId,
  } = usePrintContext();

  const [dragOver, setDragOver] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [securityOpen, setSecurityOpen] = useState(true);

  useEffect(() => {
    if (files.length > 0) setSecurityOpen(false);
  }, [files.length]);

  useEffect(() => {
    if (previewFileId && !files.find(f => f.id === previewFileId)) {
      setPreviewFileId(null);
    }
  }, [files, previewFileId, setPreviewFileId]);

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  const maxFileSize = 50 * 1024 * 1024;
  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedFileTypes.includes(ext)) {
      return t('home.fileUpload.allowedFormats', {
        formats: allowedFileTypes.join(', '),
      });
    }
    if (file.size > maxFileSize) return t('home.fileUpload.maxSizeError');
    return null;
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const uploadSingleFile = async (file: File) => {
    const error = validateFile(file);
    if (error) return;
    const id = crypto.randomUUID();

    setFiles(prev => [
      ...prev,
      {
        id,
        file,
        url: '',
        type: file.type,
        pages: 0,
        quantity: 1,
        printConfig: null,
        selectedTemplate: null,
        status: 'uploading',
      },
    ]);

    try {
      const res = await uploadFile(file);
      if (!res.success) throw new Error(res.error);
      setFiles(prev =>
        prev.map(f =>
          f.id === id
            ? { ...f, url: res.url, pages: res.pageCount, status: 'done' }
            : f
        )
      );
    } catch {
      setFiles(prev =>
        prev.map(f => (f.id === id ? { ...f, status: 'error' } : f))
      );
    }
  };

  const handleFiles = async (fileList: FileList) => {
    for (const file of Array.from(fileList)) await uploadSingleFile(file);
  };

  const previewFile = files.find(f => f.id === previewFileId) ?? null;
  return (
    <Card elevation={isMobile ? 4 : 0} sx={{ borderRadius: 3, boxShadow: 'none' }}>
      <CardHeader
        title={
          <Typography variant="h6" align="center" fontWeight={700}>
            {t('home.fileUpload.title')}
          </Typography>
        }
      />

      <CardContent>
        {/* UPLOAD ZONE */}
        <label>
          <input
            hidden
            type="file"
            multiple
            accept={allowedFileTypes.join(',')}
            onChange={e =>
              e.target.files && handleFiles(e.target.files)
            }
          />
          <Paper
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: dragOver ? 'primary.main' : 'divider',
              cursor: 'pointer',
            }}
          >
            <Upload size={isMobile ? 28 : 40} />
            <Typography mt={2} fontWeight={700}>
              {t('home.fileUpload.clickOrDrag')}
            </Typography>
          </Paper>
        </label>
        {/* SECURITY */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'success.light',
            overflow: 'hidden',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={{ xs: 2, sm: 3 }}
            py={{ xs: 1.5, sm: 2 }}
            sx={{ cursor: 'pointer', bgcolor: 'success.lighter' }}
            onClick={() => setSecurityOpen(prev => !prev)}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ShieldCheck size={isMobile ? 16 : 18} />
              <Typography fontWeight={700} fontSize={{ xs: '0.9rem', sm: '1rem' }}>
                {t('home.fileUpload.securityTitle')}
              </Typography>
            </Box>
            <IconButton size="small">
              <ExpandMoreIcon
                sx={{
                  transform: securityOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.2s',
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={securityOpen}>
            <Box px={{ xs: 2, sm: 3 }} pb={{ xs: 2, sm: 3 }}>
              <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
              <Typography
                variant="body2"
                fontSize={{ xs: '0.8rem', sm: '0.875rem' }}
                color="text.secondary"
                lineHeight={1.6}
              >
                {t('home.fileUpload.securityDescription')}
              </Typography>
            </Box>
          </Collapse>
        </Paper>
        {/* FILE LIST */}
        <Box mt={3} display="flex" flexDirection="column" gap={1.5}>
          {files.map(file => {
            const isOpen = openId === file.id;
            return (
              <Paper
                key={file.id}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: isOpen ? 'primary.main' : 'divider',
                }}
              >
                {/* HEADER */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  px={2}
                  py={1.5}
                >
                  <Box display="flex" alignItems="center" gap={1} flex={1} minWidth={0}>
                    <FileText size={18} />
                    <Typography
                      fontWeight={600}
                      noWrap
                      sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {file.file.name}
                    </Typography>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        flexShrink: 0,
                        bgcolor:
                          file.status === 'done'
                            ? 'success.main'
                            : file.status === 'error'
                              ? 'error.main'
                              : 'warning.main',
                      }}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <IconButton size="small" onClick={() => toggle(file.id)}>
                      <ExpandMoreIcon
                        sx={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: '0.2s',
                        }}
                      />
                    </IconButton>
                    <IconButton size="small" onClick={() => removeFile(file.id)}>
                      <X size={18} />
                    </IconButton>
                  </Box>
                </Box>

                {/* COLLAPSE */}
                <Collapse in={isOpen}>
                  <Box px={2} pb={2}>
                    <Divider sx={{ mb: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      Veličina: {formatSize(file.file.size)}
                    </Typography>
                    {file.pages && !isItImage(file.type) && (
                      <Typography variant="body2" color="text.secondary">
                        Stranice: {file.pages}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontWeight: 600,
                        color:
                          file.status === 'done'
                            ? 'success.main'
                            : file.status === 'error'
                              ? 'error.main'
                              : 'warning.main',
                      }}
                    >
                      Status:{' '}
                      {file.status === 'done'
                        ? 'Obrađeno'
                        : file.status === 'error'
                          ? 'Greška'
                          : 'Učitavanje...'}
                    </Typography>

                    {file.file.error && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {file.error}
                      </Alert>
                    )}

                    {/* PREVIEW BUTTON */}
                    {file.status === 'done' && (
                      <Box mt={2}>
                        <Chip
                          size="small"
                          icon={<VisibilityIcon />}
                          label={t('home.fileUpload.preview')}
                          onClick={() => setPreviewFileId(file.id)}
                          clickable
                        />
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Paper>
            );
          })}
        </Box>



        {/* PRINT CONFIG */}
        {files.length > 0 && (
          <Box mt={4}>
            <MultiFilePrintTypeSelector
              files={files.map(f => ({ type: f.type, status: f.status, id: f.id }))}
            />
          </Box>
        )}

        {/* PREVIEW MODAL */}
        <PreviewModal
          open={Boolean(previewFile)}
          onClose={() => setPreviewFileId(null)}
          printType={previewFile?.type ?? ''}
          fileUrl={previewFile?.url ?? ''}
        />
      </CardContent>
    </Card>
  );
}