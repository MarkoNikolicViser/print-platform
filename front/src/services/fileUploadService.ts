import { ref, uploadBytesResumable, getDownloadURL, deleteObject, type UploadTaskSnapshot } from "firebase/storage"
import { storage } from "../config/firebase"

export interface UploadProgress {
  progress: number
  status: "uploading" | "completed" | "error" | "paused"
  downloadURL?: string
  error?: string
}

export interface FileUploadResult {
  downloadURL: string
  fileName: string
  fileSize: number
  uploadedAt: Date
}

class FileUploadService {
  async uploadFile(
    file: File,
    folder = "documents",
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<FileUploadResult> {
    return new Promise((resolve, reject) => {
      // Create unique filename with timestamp
      const timestamp = Date.now()
      const fileName = `${timestamp}_${file.name}`
      const storageRef = ref(storage, `${folder}/${fileName}`)

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          if (onProgress) {
            onProgress({
              progress,
              status: "uploading",
            })
          }
        },
        (error) => {
          const errorMessage = this.getErrorMessage(error.code)
          if (onProgress) {
            onProgress({
              progress: 0,
              status: "error",
              error: errorMessage,
            })
          }
          reject(new Error(errorMessage))
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

            const result: FileUploadResult = {
              downloadURL,
              fileName: file.name,
              fileSize: file.size,
              uploadedAt: new Date(),
            }

            if (onProgress) {
              onProgress({
                progress: 100,
                status: "completed",
                downloadURL,
              })
            }

            resolve(result)
          } catch (error) {
            reject(error)
          }
        },
      )
    })
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fileRef = ref(storage, filePath)
      await deleteObject(fileRef)
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
    ]

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "Fajl je prevelik. Maksimalna veličina je 50MB.",
      }
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Nepodržan tip fajla. Dozvoljena su: PDF, Word, TXT, JPG, PNG, GIF.",
      }
    }

    return { isValid: true }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "storage/unauthorized":
        return "Nemate dozvolu za upload fajlova."
      case "storage/canceled":
        return "Upload je otkazan."
      case "storage/unknown":
        return "Došlo je do neočekivane greške."
      case "storage/object-not-found":
        return "Fajl nije pronađen."
      case "storage/bucket-not-found":
        return "Storage bucket nije pronađen."
      case "storage/project-not-found":
        return "Firebase projekat nije pronađen."
      case "storage/quota-exceeded":
        return "Prekoračena je kvota za storage."
      case "storage/unauthenticated":
        return "Korisnik nije autentifikovan."
      case "storage/retry-limit-exceeded":
        return "Prekoračen je broj pokušaja."
      case "storage/invalid-checksum":
        return "Fajl je oštećen tokom upload-a."
      case "storage/canceled":
        return "Upload je otkazan."
      default:
        return "Došlo je do greške tokom upload-a fajla."
    }
  }

  estimatePageCount(file: File): number {
    const fileSizeInMB = file.size / (1024 * 1024)

    switch (file.type) {
      case "application/pdf":
        // Estimate ~100KB per page for PDF
        return Math.ceil(fileSizeInMB * 10)
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        // Estimate ~50KB per page for Word documents
        return Math.ceil(fileSizeInMB * 20)
      case "text/plain":
        // Estimate ~10KB per page for text files
        return Math.ceil(fileSizeInMB * 100)
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        // Each image is typically 1 page
        return 1
      default:
        return Math.ceil(fileSizeInMB * 10) // Default estimation
    }
  }
}

export const fileUploadService = new FileUploadService()
