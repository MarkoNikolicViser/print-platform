"use client"

import { useState, useEffect } from "react"
import type { PrintJob } from "../types"
import { strapiService } from "../services/strapiService"

interface UsePrintJobsReturn {
  printJobs: PrintJob[]
  loading: boolean
  error: string | null
  createPrintJob: (jobData: Omit<PrintJob, "id" | "createdAt" | "updatedAt">) => Promise<PrintJob | null>
  updateJobStatus: (id: string, status: PrintJob["status"]) => Promise<void>
  refetch: () => Promise<void>
}

export const usePrintJobs = (filters?: { userId?: string; shopId?: string }): UsePrintJobsReturn => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrintJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const jobs = await strapiService.getPrintJobs(filters)
      setPrintJobs(jobs)
    } catch (err: any) {
      setError(err.message || "Greška pri učitavanju narudžbi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrintJobs()
  }, [filters?.userId, filters?.shopId])

  const createPrintJob = async (
    jobData: Omit<PrintJob, "id" | "createdAt" | "updatedAt">,
  ): Promise<PrintJob | null> => {
    try {
      const newJob = await strapiService.createPrintJob(jobData)
      if (newJob) {
        setPrintJobs((prev) => [newJob, ...prev])
      }
      return newJob
    } catch (err: any) {
      setError(err.message || "Greška pri kreiranju narudžbe")
      return null
    }
  }

  const updateJobStatus = async (id: string, status: PrintJob["status"]): Promise<void> => {
    try {
      const updatedJob = await strapiService.updatePrintJobStatus(id, status)
      if (updatedJob) {
        setPrintJobs((prev) => prev.map((job) => (job.id === id ? updatedJob : job)))
      }
    } catch (err: any) {
      setError(err.message || "Greška pri ažuriranju statusa")
    }
  }

  return {
    printJobs,
    loading,
    error,
    createPrintJob,
    updateJobStatus,
    refetch: fetchPrintJobs,
  }
}
