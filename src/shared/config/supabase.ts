import { createClient } from '@supabase/supabase-js';
import { getEnv } from './env.utils';

const supabaseUrl = getEnv('SUPABASE_URL', '');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY', '');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 데이터베이스 타입들은 entities에서 가져옵니다
export type { Run, CreateRunData } from '@/entities/run';
export type { LocationPoint } from '@/entities/location'; 