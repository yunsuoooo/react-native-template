-- 🏃‍♂️ 러닝앱 Supabase 테이블 구조

-- 메인 러닝 기록 테이블
create table runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  
  -- 기본 정보
  title varchar(100) default '러닝',
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  
  -- 거리 및 시간
  distance_m integer not null check (distance_m > 0),
  duration_ms bigint not null check (duration_ms > 0),
  
  -- 속도 정보 (m/s)
  avg_speed_ms numeric(6,3),
  max_speed_ms numeric(6,3),
  
  -- 페이스 정보 (초/km)
  avg_pace_s_per_km integer,
  
  -- 칼로리 (선택적)
  calories_burned integer check (calories_burned >= 0),
  
  -- 경로 데이터
  route_json jsonb not null,
  total_points integer not null default 0,
  
  -- 고도 정보 (선택적)
  elevation_gain_m numeric(8,2) default 0,
  elevation_loss_m numeric(8,2) default 0,
  
  -- 러닝 타입
  run_type varchar(20) default 'casual' check (run_type in ('casual', 'training', 'race', 'interval')),
  
  -- 메모 및 설정
  notes text,
  is_public boolean default false,
  
  -- 날씨 정보 (선택적)
  weather_temp_c integer,
  weather_condition varchar(50),
  
  -- 메타데이터
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 인덱스 생성
create index idx_runs_user_id on runs(user_id);
create index idx_runs_created_at on runs(created_at desc);
create index idx_runs_distance on runs(distance_m desc);
create index idx_runs_public on runs(is_public) where is_public = true;

-- RLS (Row Level Security) 설정
alter table runs enable row level security;

-- 정책: 사용자는 자신의 러닝 기록만 조회/수정 가능
create policy "Users can view own runs" on runs
  for select using (auth.uid() = user_id);

create policy "Users can insert own runs" on runs
  for insert with check (auth.uid() = user_id);

create policy "Users can update own runs" on runs
  for update using (auth.uid() = user_id);

create policy "Users can delete own runs" on runs
  for delete using (auth.uid() = user_id);

-- 공개 러닝 기록 조회 정책 (다른 사용자들이 공개된 기록 볼 수 있음)
create policy "Anyone can view public runs" on runs
  for select using (is_public = true);

-- updated_at 자동 업데이트 트리거
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_runs_updated_at
  before update on runs
  for each row
  execute function update_updated_at_column();

-- 🎯 러닝 통계를 위한 뷰
create view user_run_stats as
select 
  user_id,
  count(*) as total_runs,
  sum(distance_m) as total_distance_m,
  sum(duration_ms) as total_duration_ms,
  avg(distance_m) as avg_distance_m,
  avg(duration_ms) as avg_duration_ms,
  avg(avg_speed_ms) as avg_speed_ms,
  max(distance_m) as longest_run_m,
  max(duration_ms) as longest_duration_ms,
  min(start_time) as first_run_date,
  max(start_time) as last_run_date
from runs
group by user_id;

-- 📊 월별 러닝 통계 뷰
create view monthly_run_stats as
select 
  user_id,
  date_trunc('month', start_time) as month,
  count(*) as runs_count,
  sum(distance_m) as total_distance_m,
  sum(duration_ms) as total_duration_ms,
  avg(distance_m) as avg_distance_m
from runs
group by user_id, date_trunc('month', start_time)
order by month desc;

-- 🏆 개인 기록 뷰 (PB - Personal Best)
create view personal_bests as
select 
  user_id,
  max(distance_m) as longest_distance_m,
  min(avg_pace_s_per_km) as best_pace_s_per_km,
  max(avg_speed_ms) as fastest_speed_ms,
  max(duration_ms) as longest_duration_ms
from runs
where avg_pace_s_per_km is not null
group by user_id; 