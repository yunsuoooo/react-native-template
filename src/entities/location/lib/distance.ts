import type { LocationPoint } from '../model/types';

/**
 * Haversine 공식을 사용하여 두 좌표 간의 거리를 계산합니다
 * @param point1 첫 번째 좌표
 * @param point2 두 번째 좌표
 * @returns 거리 (미터)
 */
export function getDistance(point1: LocationPoint, point2: LocationPoint): number {
  const R = 6371e3; // 지구 반지름 (미터)
  
  const lat1Rad = (point1.latitude * Math.PI) / 180;
  const lat2Rad = (point2.latitude * Math.PI) / 180;
  const deltaLatRad = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const deltaLngRad = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a = 
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 거리 (미터)
}

/**
 * 좌표 배열의 총 거리를 계산합니다
 * @param points 좌표 배열
 * @returns 총 거리 (미터)
 */
export function getTotalDistance(points: LocationPoint[]): number {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += getDistance(points[i - 1], points[i]);
  }

  return totalDistance;
}

/**
 * 두 좌표 간의 방향을 계산합니다 (bearing)
 * @param point1 시작점
 * @param point2 끝점
 * @returns 방향 (도, 0-360)
 */
export function getBearing(point1: LocationPoint, point2: LocationPoint): number {
  const lat1Rad = (point1.latitude * Math.PI) / 180;
  const lat2Rad = (point2.latitude * Math.PI) / 180;
  const deltaLngRad = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
           Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = (bearingRad * 180) / Math.PI;

  return (bearingDeg + 360) % 360; // 0-360도로 정규화
}

/**
 * 두 LocationPoint 간의 거리 계산 (wrapper function)
 */
export function getDistanceBetweenPoints(point1: LocationPoint, point2: LocationPoint): number {
  return getDistance(point1, point2);
} 