"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Box, Paper, Typography, Button, LinearProgress, Alert, Chip, Grid, Card, CardContent } from "@mui/material"
import { useDropzone } from "react-dropzone"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useFileUpload } from "../hooks/useFileUpload"
import { fileUploadService } from "../services/fileUploadService"

interface FileUploadSectionProps {
  onFileUploaded: (fileData: {
    fileName: string
    fileUrl: string
    fileSize: number
    pageCount: number
  }) => void
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onFileUploaded }) => {
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string
    fileUrl: string
    fileSize: number
    pageCount: number
  } | null>(null)

  const { uploadFile, progress, isUploading, error, reset } = useFileUpload()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]

      // Validate file
      const validation = fileUploadService.validateFile(file)
      if (!validation.isValid) {
        return
      }

      try {
        const result = await uploadFile(file, "print-documents")
        const pageCount = fileUploadService.estimatePageCount(file)

        const fileData = {
          fileName: result.fileName,
          fileUrl: result.downloadURL,
          fileSize: result.fileSize,
          pageCount,
        }

        setUploadedFile(fileData)
        onFileUploaded(fileData)
      } catch (err) {
        console.error("Upload failed:", err)
      }
    },
    [uploadFile, onFileUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleReset = () => {
    setUploadedFile(null)
    reset()
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
        KORAK 1: UPLOAD FAJL
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: "text.primary" }}>
        Da biste videli cenu u realnom vremenu, upload-ujte .pdf, .doc, .docx, .txt ili sliku. Više tipova fajlova
        uskoro!
      </Typography>

      {!uploadedFile && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: isDragActive ? "secondary.main" : "primary.main",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive ? "rgba(249, 115, 22, 0.05)" : "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "secondary.main",
                  backgroundColor: "rgba(249, 115, 22, 0.05)",
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ mb: 1, color: "primary.main" }}>
                Prevucite i otpustite fajl ovde
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ili kliknite da izaberete fajl
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              sx={{
                py: 2,
                fontSize: "1rem",
                fontWeight: 600,
              }}
              onClick={() => document.querySelector('input[type="file"]')?.click()}
            >
              Upload fajl
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                Podržani formati:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {["PDF", "DOC", "DOCX", "TXT", "JPG", "PNG", "GIF"].map((format) => (
                  <Chip
                    key={format}
                    label={format}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Upload Progress */}
      {isUploading && progress && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Upload u toku... {Math.round(progress.progress)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(30, 58, 138, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "secondary.main",
              },
            }}
          />
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }} onClose={handleReset}>
          {error}
        </Alert>
      )}

      {/* Uploaded File Display */}
      {uploadedFile && (
        <Card
          sx={{
            mt: 3,
            border: "2px solid",
            borderColor: "success.main",
            backgroundColor: "rgba(16, 185, 129, 0.05)",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CheckCircleIcon sx={{ color: "success.main", mr: 1 }} />
              <Typography variant="h6" sx={{ color: "success.main" }}>
                Fajl uspešno upload-ovan!
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <InsertDriveFileIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {uploadedFile.fileName}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Veličina: {formatFileSize(uploadedFile.fileSize)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  Procenjeni broj strana: {uploadedFile.pageCount}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleReset}
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                  }}
                >
                  Upload novi fajl
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Paper>
  )
}

export default FileUploadSection
