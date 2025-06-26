import { supabase } from '@/shared/config';
import type {
  Run,
  CreateRunData,
  UpdateRunData,
  UserRunStats,
  MonthlyRunStats,
  PersonalBests,
} from '../model/types';
import { calculateRunStats } from '../lib/utils';

/**
 * 러닝 데이터를 Supabase에 저장
 */
export async function saveRun(runData: Omit<Run, 'id' | 'user_id' | 'created_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('runs')
      .insert({
        ...runData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error saving run:', error);
    return { success: false, error };
  }
}

/**
 * 사용자의 러닝 기록 가져오기
 */
export async function fetchUserRuns(limit = 20): Promise<{ success: boolean; data?: Run[]; error?: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching runs:', error);
    return { success: false, error };
  }
}

/**
 * 특정 러닝 기록 가져오기
 */
export async function fetchRunById(id: string): Promise<{ success: boolean; data?: Run; error?: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching run:', error);
    return { success: false, error };
  }
}

/**
 * 러닝 기록 삭제
 */
export async function deleteRun(id: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('runs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting run:', error);
    return { success: false, error };
  }
}

export const runApi = {
  // 러닝 기록 생성
  async createRun(data: CreateRunData): Promise<Run> {
    // 일시정지된 포인트 제외하고 통계 계산
    const activePoints = data.route_json.filter((point) => !point.isPaused);
    const stats = calculateRunStats(activePoints, data.duration_ms);

    const runData = {
      ...data,
      total_points: data.route_json.length, // 전체 포인트 수 (일시정지 포함)
      avg_speed_ms: stats.avgSpeed,
      max_speed_ms: stats.maxSpeed,
      avg_pace_s_per_km: stats.pace,
      calories_burned: stats.calories,
      elevation_gain_m: stats.elevationGain,
      elevation_loss_m: stats.elevationLoss,
    };

    const { data: run, error } = await supabase
      .from('runs')
      .insert(runData)
      .select()
      .single();

    if (error) throw error;
    return run;
  },

  // 러닝 기록 목록 조회
  async getRuns(limit = 20, offset = 0): Promise<Run[]> {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // 특정 러닝 기록 조회
  async getRun(id: string): Promise<Run | null> {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // 데이터 없음
      throw error;
    }
    return data;
  },

  // 러닝 기록 수정
  async updateRun(id: string, updates: UpdateRunData): Promise<Run> {
    // 경로가 업데이트되면 통계 다시 계산
    let updateData = { ...updates };
    if (updates.route_json && updates.duration_ms) {
      // 일시정지된 포인트 제외하고 통계 계산
      const activePoints = updates.route_json.filter((point) => !point.isPaused);
      const stats = calculateRunStats(activePoints, updates.duration_ms);
      updateData = {
        ...updateData,
        total_points: updates.route_json.length, // 전체 포인트 수 (일시정지 포함)
        avg_speed_ms: stats.avgSpeed,
        max_speed_ms: stats.maxSpeed,
        avg_pace_s_per_km: stats.pace,
        calories_burned: stats.calories,
        elevation_gain_m: stats.elevationGain,
        elevation_loss_m: stats.elevationLoss,
      };
    }

    const { data, error } = await supabase
      .from('runs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 러닝 기록 삭제
  async deleteRun(id: string): Promise<void> {
    const { error } = await supabase
      .from('runs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // 공개 러닝 기록 조회 (피드용)
  async getPublicRuns(limit = 20, offset = 0): Promise<Run[]> {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // 사용자 러닝 통계 조회
  async getUserStats(userId?: string): Promise<UserRunStats | null> {
    let query = supabase
      .from('user_run_stats')
      .select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // 데이터 없음
      throw error;
    }
    return data;
  },

  // 월별 러닝 통계 조회
  async getMonthlyStats(year?: number, month?: number): Promise<MonthlyRunStats[]> {
    let query = supabase
      .from('monthly_run_stats')
      .select('*')
      .order('month', { ascending: false });

    if (year && month) {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0).toISOString();
      query = query
        .gte('month', startDate)
        .lte('month', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // 개인 기록 조회
  async getPersonalBests(userId?: string): Promise<PersonalBests | null> {
    let query = supabase
      .from('personal_bests')
      .select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // 데이터 없음
      throw error;
    }
    return data;
  },

  // 러닝 타입별 통계
  async getRunsByType(runType: string): Promise<Run[]> {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('run_type', runType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 거리별 러닝 기록 검색
  async getRunsByDistance(minDistance: number, maxDistance?: number): Promise<Run[]> {
    let query = supabase
      .from('runs')
      .select('*')
      .gte('distance_m', minDistance);

    if (maxDistance) {
      query = query.lte('distance_m', maxDistance);
    }

    query = query.order('distance_m', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },
};
