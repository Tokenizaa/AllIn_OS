import { useState, useCallback } from 'react'

import { StorageService } from '@/integrations/supabase/services/storage'

interface UseStorageReturn {
  uploading: boolean
  deleting: boolean
  error: Error | null
  uploadFile: (file: File, bucketName: string, fileName?: string) => Promise<string | null>
  uploadMultipleFiles: (files: File[], bucketName: string) => Promise<string[]>
  deleteFile: (fileName: string, bucketName: string) => Promise<boolean>
  deleteMultipleFiles: (fileNames: string[], bucketName: string) => Promise<boolean>
  getFileUrl: (fileName: string, bucketName: string) => string
  listFiles: (bucketName: string, limit?: number) => Promise<any[]>
  moveFile: (fileName: string, sourceBucket: string, destinationBucket: string) => Promise<boolean>
}

export const useSupabaseStorage = (): UseStorageReturn => {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(async (file: File, bucketName: string, fileName?: string) => {
    try {
      setUploading(true)
      setError(null)
      const result = await StorageService.uploadFile(file, bucketName, fileName)
      return result
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao fazer upload do arquivo:', err)
      return null
    } finally {
      setUploading(false)
    }
  }, [])

  const uploadMultipleFiles = useCallback(async (files: File[], bucketName: string) => {
    try {
      setUploading(true)
      setError(null)
      const results = await StorageService.uploadMultipleFiles(files, bucketName)
      return results
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao fazer upload de múltiplos arquivos:', err)
      return []
    } finally {
      setUploading(false)
    }
  }, [])

  const deleteFile = useCallback(async (fileName: string, bucketName: string) => {
    try {
      setDeleting(true)
      setError(null)
      const result = await StorageService.deleteFile(fileName, bucketName)
      return result
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao remover arquivo:', err)
      return false
    } finally {
      setDeleting(false)
    }
  }, [])

  const deleteMultipleFiles = useCallback(async (fileNames: string[], bucketName: string) => {
    try {
      setDeleting(true)
      setError(null)
      const result = await StorageService.deleteMultipleFiles(fileNames, bucketName)
      return result
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao remover múltiplos arquivos:', err)
      return false
    } finally {
      setDeleting(false)
    }
  }, [])

  const getFileUrl = useCallback((fileName: string, bucketName: string) => {
    return StorageService.getFileUrl(fileName, bucketName)
  }, [])

  const listFiles = useCallback(async (bucketName: string, limit?: number) => {
    try {
      setUploading(true)
      setError(null)
      const results = await StorageService.listFiles(bucketName, limit)
      return results
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao listar arquivos:', err)
      return []
    } finally {
      setUploading(false)
    }
  }, [])

  const moveFile = useCallback(async (fileName: string, sourceBucket: string, destinationBucket: string) => {
    try {
      setUploading(true)
      setError(null)
      const result = await StorageService.moveFile(fileName, sourceBucket, destinationBucket)
      return result
    } catch (err) {
      setError(err as Error)
      console.error('Erro ao mover arquivo:', err)
      return false
    } finally {
      setUploading(false)
    }
  }, [])

  return {
    uploading,
    deleting,
    error,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    deleteMultipleFiles,
    getFileUrl,
    listFiles,
    moveFile
  }
}