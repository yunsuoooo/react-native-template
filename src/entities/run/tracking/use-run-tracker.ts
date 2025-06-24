import { useState, useEffect, useRef, useMemo } from 'react';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { getDistance } from '@/entities/location';
import { runApi } from '../api/runApi';
import { useTimer } from '@/shared/hooks';
import type { LocationPoint } from '@/entities/location';
import type { RunStats } from '../model/types';

interface UseRunTrackerOptions {
  minDistance?: number; // 최소 이동 거리 (미터)
  updateInterval?: number; // 위치 업데이트 간격 (밀리초)
}

interface UseRunTrackerReturn {
  // 상태
  isTracking: boolean;
  isPaused: boolean;
  currentLocation: LocationPoint | null;
  routePoints: LocationPoint[];
  stats: RunStats;
  
  // 액션
  startTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  stopTracking: () => Promise<void>;
  resetTracking: () => void;
  
  // 추가 정보
  error: string | null;
}

export function useRunTracker(options: UseRunTrackerOptions = {}): UseRunTrackerReturn {
  const {
    minDistance = 5, // 5미터 이상 움직였을 때만 기록
    updateInterval = 3000, // 3초마다 위치 업데이트
  } = options;

  // 타이머 hook 사용
  const timer = useTimer({ updateInterval: 100 });

  // 상태
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [routePoints, setRoutePoints] = useState<LocationPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 위치 추적 관련 ref들
  const watchIdRef = useRef<number | null>(null);

  // 새로운 위치를 처리하는 함수
  const handleNewLocation = (position: GeoPosition) => {
    const newPoint: LocationPoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude || undefined,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
      timestamp: new Date().toISOString(),
    };

    setCurrentLocation(newPoint);

    // 일시정지 중이면 위치만 업데이트하고 경로에는 추가하지 않음
    if (timer.isPaused) return;

    setRoutePoints(prev => {
      // 첫 번째 포인트는 무조건 추가
      if (prev.length === 0) {
        return [newPoint];
      }

      // 마지막 포인트와의 거리 계산
      const lastPoint = prev[prev.length - 1];
      const distance = getDistance(lastPoint, newPoint);

      // 최소 거리 이상 움직였을 때만 추가
      if (distance >= minDistance) {
        return [...prev, newPoint];
      }

      return prev;
    });
  };

  // 위치 추적 시작
  const startTracking = () => {
    setError(null);
    
    const watchId = Geolocation.watchPosition(
      handleNewLocation,
      (err) => {
        console.error('Location error:', err);
        setError(`위치 추적 오류: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        interval: updateInterval,
        fastestInterval: 1000,
        distanceFilter: 1, // 1미터마다 업데이트
      }
    );

    watchIdRef.current = watchId;
    setIsTracking(true);
    
    // 타이머 시작
    timer.start();
  };

  // 위치 추적 일시정지
  const pauseTracking = () => {
    timer.pause();
  };

  // 위치 추적 재개
  const resumeTracking = () => {
    timer.resume();
  };

  // 위치 추적 중지 및 저장
  const stopTracking = async (): Promise<void> => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // 타이머 정지
    timer.stop();
    setIsTracking(false);

    // 러닝 데이터 저장
    if (routePoints.length > 1) {
      try {
        const endTime = new Date();
        
        // 총 거리 계산
        let totalDistance = 0;
        for (let i = 1; i < routePoints.length; i++) {
          totalDistance += getDistance(routePoints[i - 1], routePoints[i]);
        }

        const runData = {
          start_time: new Date(Date.now() - timer.totalElapsedTime).toISOString(),
          end_time: endTime.toISOString(),
          distance_m: Math.round(totalDistance),
          duration_ms: timer.elapsedTime, // 실제 러닝 시간
          total_elapsed_time_ms: timer.totalElapsedTime, // 전체 경과 시간
          route_json: routePoints,
        };

        await runApi.createRun(runData);
        console.log('러닝 데이터 저장 완료');
        
        // 상태 초기화
        resetTracking();
      } catch (err) {
        console.error('러닝 데이터 저장 실패:', err);
        setError('데이터 저장에 실패했습니다.');
      }
    }
  };

  // 추적 데이터 초기화
  const resetTracking = () => {
    setCurrentLocation(null);
    setRoutePoints([]);
    setError(null);
    timer.reset();
  };

  // 경로 기반 통계 계산 (위치 업데이트시에만 계산)
  const routeStats = useMemo(() => {
    if (routePoints.length < 2) {
      return {
        distance: 0,
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
    let lastElevation = routePoints[0]?.altitude || 0;

    for (let i = 1; i < routePoints.length; i++) {
      const prev = routePoints[i - 1];
      const curr = routePoints[i];
      
      // 거리 계산
      const segmentDistance = getDistance(prev, curr);
      totalDistance += segmentDistance;
      
      // 속도 계산 (시간 차이가 있는 경우)
      if (prev.timestamp && curr.timestamp) {
        const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000;
        if (timeDiff > 0) {
          const segmentSpeed = segmentDistance / timeDiff;
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

    const durationSeconds = timer.elapsedTime / 1000;
    const avgSpeed = durationSeconds > 0 ? totalDistance / durationSeconds : 0;
    const pace = totalDistance > 0 ? (durationSeconds / (totalDistance / 1000)) : 0;

    return {
      distance: Math.round(totalDistance),
      pace: Math.round(pace),
      speed: parseFloat(avgSpeed.toFixed(2)),
      avgSpeed: parseFloat(avgSpeed.toFixed(2)),
      maxSpeed: parseFloat(maxSpeed.toFixed(2)),
      calories: Math.round((8 * 70 * (timer.elapsedTime / (1000 * 60 * 60)))),
      elevationGain: Math.round(elevationGain),
      elevationLoss: Math.round(elevationLoss),
    };
  }, [routePoints, timer.elapsedTime]);

  // 최종 통계 객체
  const stats: RunStats = {
    ...routeStats,
    duration: timer.elapsedTime,
    totalElapsedTime: timer.totalElapsedTime,
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    // 상태
    isTracking,
    isPaused: timer.isPaused,
    currentLocation,
    routePoints,
    stats,
    
    // 액션
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    resetTracking,
    
    // 추가 정보
    error,
  };
} 