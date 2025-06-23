import { getDistance } from '@/entities/location';
import type { LocationPoint } from '@/entities/location';
import type { RunStats } from '../model/types';

/**
 * 러닝 경로에서 통계를 계산합니다
 */
export function calculateRunStats(
  route: LocationPoint[], 
  durationMs: number,
  userWeight = 70 // kg, 기본값
): RunStats {
  if (route.length < 2) {
    return {
      distance: 0,
      duration: durationMs,
      pace: 0,
      speed: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      calories: 0,
      elevationGain: 0,
      elevationLoss: 0,
    };
  }

  // 총 거리 계산
  let totalDistance = 0;
  let maxSpeed = 0;
  let elevationGain = 0;
  let elevationLoss = 0;
  let lastElevation = route[0].altitude || 0;

  const speeds: number[] = [];

  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1];
    const curr = route[i];
    
    // 거리 계산
    const segmentDistance = getDistance(prev, curr);
    totalDistance += segmentDistance;
    
    // 속도 계산 (시간 차이가 있는 경우)
    if (prev.timestamp && curr.timestamp) {
      const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000; // 초
      if (timeDiff > 0) {
        const segmentSpeed = segmentDistance / timeDiff; // m/s
        speeds.push(segmentSpeed);
        maxSpeed = Math.max(maxSpeed, segmentSpeed);
      }
    }
    
    // 고도 변화 계산
    if (curr.altitude !== undefined && lastElevation !== undefined) {
      const elevationDiff = curr.altitude - lastElevation;
      if (elevationDiff > 0) {
        elevationGain += elevationDiff;
      } else {
        elevationLoss += Math.abs(elevationDiff);
      }
      lastElevation = curr.altitude;
    }
  }

  const durationSeconds = durationMs / 1000;
  const avgSpeed = durationSeconds > 0 ? totalDistance / durationSeconds : 0;
  
  // 페이스 계산 (초/km)
  const pace = totalDistance > 0 ? (durationSeconds / (totalDistance / 1000)) : 0;
  
  // 칼로리 계산 (간단한 공식: MET * 체중 * 시간)
  // 러닝 MET 값은 속도에 따라 달라짐 (약 8-15)
  const avgPaceMinutesPerKm = pace / 60;
  let met = 8; // 기본 MET 값
  
  if (avgPaceMinutesPerKm < 4) met = 15; // 매우 빠름
  else if (avgPaceMinutesPerKm < 5) met = 12; // 빠름
  else if (avgPaceMinutesPerKm < 6) met = 10; // 보통
  else if (avgPaceMinutesPerKm < 7) met = 8; // 천천히
  
  const durationHours = durationMs / (1000 * 60 * 60);
  const calories = Math.round(met * userWeight * durationHours);

  return {
    distance: Math.round(totalDistance),
    duration: durationMs,
    pace: Math.round(pace),
    speed: parseFloat(avgSpeed.toFixed(2)),
    avgSpeed: parseFloat(avgSpeed.toFixed(2)),
    maxSpeed: parseFloat(maxSpeed.toFixed(2)),
    calories,
    elevationGain: Math.round(elevationGain),
    elevationLoss: Math.round(elevationLoss),
  };
}

/**
 * 거리를 포맷팅합니다
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * 시간을 포맷팅합니다
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 페이스를 포맷팅합니다 (분:초/km)
 */
export function formatPace(secondsPerKm: number): string {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

/**
 * 속도를 포맷팅합니다 (km/h)
 */
export function formatSpeed(metersPerSecond: number): string {
  const kmh = metersPerSecond * 3.6;
  return `${kmh.toFixed(1)} km/h`;
}

/**
 * 러닝 타입을 한글로 변환
 */
export function getRunTypeLabel(runType: string): string {
  const labels: Record<string, string> = {
    casual: '캐주얼',
    training: '훈련',
    race: '경주',
    interval: '인터벌',
  };
  return labels[runType] || runType;
} 