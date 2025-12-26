"use client"

import { useState, useCallback } from "react"
import { fileUploadService, type UploadProgress, type FileUploadResult } from "../services/fileUploadService"

interface UseFileUploadReturn {
  uploadFile: (file: File, folder?: string) => Promise<FileUploadResult>
  progress: UploadProgress | null
  isUploading: boolean
  error: string | null
  reset: () => void
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (file: File, folder = "documents"): Promise<FileUploadResult> => {
    setIsUploading(true)
    setError(null)
    setProgress(null)

    try {
      // Validate file first
      const validation = fileUploadService.validateFile(file)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const result = await fileUploadService.uploadFile(file, folder, (progressData) => {
        setProgress(progressData)
      })

      setIsUploading(false)
      return result
    } catch (err: any) {
      setError(err.message)
      setIsUploading(false)
      setProgress({
        progress: 0,
        status: "error",
        error: err.message,
      })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setProgress(null)
    setIsUploading(false)
    setError(null)
  }, [])

  return {
    uploadFile,
    progress,
    isUploading,
    error,
    reset,
  }
}
