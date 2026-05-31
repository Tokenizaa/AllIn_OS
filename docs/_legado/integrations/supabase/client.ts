import { createClient } from '@supabase/supabase-js'

// Tipos para o cliente Supabase
export type SupabaseClient = ReturnType<typeof createClient>

// Variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar variáveis de ambiente
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Exportar tipos úteis
export type {
  Session,
  User,
  AuthError,
  PostgrestError,
  RealtimeChannel
} from '@supabase/supabase-js'