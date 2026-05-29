import { supabase } from '../client'

/**
 * Serviço para gerenciar o storage do Supabase
 */
export class StorageService {
  /**
   * Faz upload de um arquivo
   * @param file Arquivo a ser enviado
   * @param bucketName Nome do bucket
   * @param fileName Nome do arquivo (opcional)
   * @returns URL do arquivo ou null em caso de erro
   */
  static async uploadFile(file: File, bucketName: string, fileName?: string): Promise<string | null> {
    try {
      const fileNameToUse = fileName || `${Date.now()}_${file.name}`
      
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(fileNameToUse, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(fileNameToUse)

      return publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error)
      return null
    }
  }

  /**
   * Faz upload de múltiplos arquivos
   * @param files Array de arquivos a serem enviados
   * @param bucketName Nome do bucket
   * @returns Array de URLs dos arquivos
   */
  static async uploadMultipleFiles(files: File[], bucketName: string): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, bucketName))
      const results = await Promise.all(uploadPromises)
      return results.filter((url): url is string => url !== null)
    } catch (error) {
      console.error('Erro ao fazer upload de múltiplos arquivos:', error)
      return []
    }
  }

  /**
   * Remove um arquivo
   * @param fileName Nome do arquivo
   * @param bucketName Nome do bucket
   * @returns true se removido, false caso contrário
   */
  static async deleteFile(fileName: string, bucketName: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .storage
        .from(bucketName)
        .remove([fileName])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao remover arquivo:', error)
      return false
    }
  }

  /**
   * Remove múltiplos arquivos
   * @param fileNames Array de nomes de arquivos
   * @param bucketName Nome do bucket
   * @returns true se removidos, false caso contrário
   */
  static async deleteMultipleFiles(fileNames: string[], bucketName: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .storage
        .from(bucketName)
        .remove(fileNames)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao remover múltiplos arquivos:', error)
      return false
    }
  }

  /**
   * Obtém a URL pública de um arquivo
   * @param fileName Nome do arquivo
   * @param bucketName Nome do bucket
   * @returns URL pública do arquivo
   */
  static getFileUrl(fileName: string, bucketName: string): string {
    const { data } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  /**
   * Lista arquivos em um bucket
   * @param bucketName Nome do bucket
   * @param limit Limite de arquivos (opcional)
   * @returns Lista de arquivos
   */
  static async listFiles(bucketName: string, limit?: number): Promise<any[]> {
    try {
      const query = supabase
        .storage
        .from(bucketName)
        .list()

      if (limit) {
        // Note: Supabase storage list doesn't support limit directly
        // We'll need to handle this in the application layer
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar arquivos:', error)
      return []
    }
  }

  /**
   * Move um arquivo de um bucket para outro
   * @param fileName Nome do arquivo
   * @param sourceBucket Bucket de origem
   * @param destinationBucket Bucket de destino
   * @returns true se movido, false caso contrário
   */
  static async moveFile(fileName: string, sourceBucket: string, destinationBucket: string): Promise<boolean> {
    try {
      // Primeiro, obter o arquivo do bucket de origem
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from(sourceBucket)
        .download(fileName)

      if (downloadError) throw downloadError
      if (!fileData) throw new Error('Arquivo não encontrado')

      // Em seguida, fazer upload para o bucket de destino
      const arrayBuffer = await fileData.arrayBuffer()
      const file = new File([arrayBuffer], fileName, { type: fileData.type })
      
      const uploadResult = await this.uploadFile(file, destinationBucket, fileName)
      if (!uploadResult) throw new Error('Falha ao fazer upload para o bucket de destino')

      // Finalmente, remover do bucket de origem
      const deleteResult = await this.deleteFile(fileName, sourceBucket)
      if (!deleteResult) throw new Error('Falha ao remover do bucket de origem')

      return true
    } catch (error) {
      console.error('Erro ao mover arquivo:', error)
      return false
    }
  }
}