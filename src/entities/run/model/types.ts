import type { LocationPoint } from '@/entities/location';

export interface Run {
  id: string;
  user_id: string;
  
  // 기본 정보
  title: string;
  start_time: string;
  end_time: string;
  
  // 거리 및 시간
  distance_m: number;
  duration_ms: number; // 실제 러닝 시간 (일시정지 시간 제외)
  total_elapsed_time_ms: number; // 전체 경과 시간 (일시정지 시간 포함)
  
  // 속도 정보 (m/s)
  avg_speed_ms?: number;
  max_speed_ms?: number;
  
  // 페이스 정보 (초/km)
  avg_pace_s_per_km?: number;
  
  // 칼로리 (선택적)
  calories_burned?: number;
  
  // 경로 데이터
  route_json: LocationPoint[];
  total_points: number;
  
  // 고도 정보 (선택적)
  elevation_gain_m?: number;
  elevation_loss_m?: number;
  
  // 러닝 타입
  run_type: 'casual' | 'training' | 'race' | 'interval';
  
  // 메모 및 설정
  notes?: string;
  is_public: boolean;
  
  // 날씨 정보 (선택적)
  weather_temp_c?: number;
  weather_condition?: string;
  
  // 메타데이터
  created_at: string;
  updated_at: string;
}

export interface CreateRunData {
  title?: string;
  start_time: string;
  end_time: string;
  distance_m: number;
  duration_ms: number; // 실제 러닝 시간
  total_elapsed_time_ms: number; // 전체 경과 시간
  route_json: LocationPoint[];
  
  // 통계 필드들 (자동 계산되지만 수동 입력 가능)
  total_points?: number;
  avg_speed_ms?: number;
  max_speed_ms?: number;
  avg_pace_s_per_km?: number;
  calories_burned?: number;
  elevation_gain_m?: number;
  elevation_loss_m?: number;
  
  run_type?: 'casual' | 'training' | 'race' | 'interval';
  notes?: string;
  is_public?: boolean;
  weather_temp_c?: number;
  weather_condition?: string;
}

export interface UpdateRunData {
  title?: string;
  start_time?: string;
  end_time?: string;
  distance_m?: number;
  duration_ms?: number; // 실제 러닝 시간
  total_elapsed_time_ms?: number; // 전체 경과 시간
  route_json?: LocationPoint[];
  
  // 통계 필드들
  total_points?: number;
  avg_speed_ms?: number;
  max_speed_ms?: number;
  avg_pace_s_per_km?: number;
  calories_burned?: number;
  elevation_gain_m?: number;
  elevation_loss_m?: number;
  
  run_type?: 'casual' | 'training' | 'race' | 'interval';
  notes?: string;
  is_public?: boolean;
  weather_temp_c?: number;
  weather_condition?: string;
}

export interface RunStats {
  // 기본 통계
  distance: number; // meters
  duration: number; // milliseconds (actual running time, excluding paused time)
  totalElapsedTime: number; // milliseconds (total time from start to current)
  pace: number; // seconds per km
  speed: number; // m/s
  
  // 추가 통계
  avgSpeed: number;
  maxSpeed: number;
  calories?: number;
  elevationGain?: number;
  elevationLoss?: number;
}

// 통계 뷰 타입들
export interface UserRunStats {
  user_id: string;
  total_runs: number;
  total_distance_m: number;
  total_duration_ms: number;
  avg_distance_m: number;
  avg_duration_ms: number;
  avg_speed_ms: number;
  longest_run_m: number;
  longest_duration_ms: number;
  first_run_date: string;
  last_run_date: string;
}

export interface MonthlyRunStats {
  user_id: string;
  month: string;
  runs_count: number;
  total_distance_m: number;
  total_duration_ms: number;
  avg_distance_m: number;
}

export interface PersonalBests {
  user_id: string;
  longest_distance_m: number;
  best_pace_s_per_km: number;
  fastest_speed_ms: number;
  longest_duration_ms: number;
}

export interface RunStatus {
  isActive: boolean;
  isPaused: boolean;
  startTime?: Date;
  pausedTime?: Date;
} 