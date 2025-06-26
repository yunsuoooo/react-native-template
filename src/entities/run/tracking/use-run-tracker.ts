import { useState, useEffect, useRef, useMemo } from 'react';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { getDistance } from '@/entities/location';
import { runApi } from '../api/runApi';
import { useTimer } from '@/shared/hooks';
import type { LocationPoint } from '@/entities/location';
import type { RunStats } from '../model/types';

// 경로 기반 통계만 포함하는 타입 (duration, totalElapsedTime 제외)
type RouteStatsOnly = Omit<RunStats, 'duration' | 'totalElapsedTime'>;

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

  // 초기 통계 값 생성 함수 (duration과 totalElapsedTime 제외)
  const createInitialStats = (): RouteStatsOnly => ({
    distance: 0,
    pace: 0,
    speed: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    calories: 0,
    elevationGain: 0,
    elevationLoss: 0,
  });

  // 타이머 hook 사용
  const timer = useTimer({ updateInterval: 100 });

  // 상태
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [routePoints, setRoutePoints] = useState<LocationPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 위치 추적 관련 ref들
  const watchIdRef = useRef<number | null>(null);
  const lastValidStatsRef = useRef<RouteStatsOnly>(createInitialStats());

  // 마지막 계산한 포인트의 timestamp 저장
  const lastCalculatedTimestampRef = useRef<string | null>(null);

  // 새로운 위치를 처리하는 함수
  const handleNewLocation = (position: GeoPosition) => {
    const newPoint: LocationPoint = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude || undefined,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
      timestamp: new Date(position.timestamp).toISOString(), // GeoPosition timestamp를 ISO 문자열로 변환
      isPaused: timer.isPaused, // 일시정지 상태 기록
    };

    setCurrentLocation(newPoint);

    // 위치는 항상 경로에 추가 (일시정지 여부와 관계없이)
    setRoutePoints((prev) => {
      // 첫 번째 포인트는 무조건 추가
      if (prev.length === 0) {
        return [newPoint];
      }

      // 일시정지 중이 아닐 때만 거리 기반 필터링 적용
      if (!timer.isPaused) {
        // 마지막 활성(non-paused) 포인트와의 거리 계산
        const lastActivePoint = prev.slice().reverse().find((p) => !p.isPaused);
        if (lastActivePoint) {
          const distance = getDistance(lastActivePoint, newPoint);

          // 최소 거리 이상 움직였을 때만 추가
          if (distance < minDistance) {
            return prev;
          }
        }
      }

      return [...prev, newPoint];
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
      },
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

        // 총 거리 계산 (일시정지된 포인트 제외)
        const activePoints = routePoints.filter((point) => !point.isPaused);
        let totalDistance = 0;
        for (let i = 1; i < activePoints.length; i++) {
          totalDistance += getDistance(activePoints[i - 1], activePoints[i]);
        }

        const runData = {
          start_time: new Date(Date.now() - timer.totalElapsedTime).toISOString(),
          end_time: endTime.toISOString(),
          distance_m: Math.round(totalDistance),
          duration_ms: timer.elapsedTime, // 실제 러닝 시간
          total_elapsed_time_ms: timer.totalElapsedTime, // 전체 경과 시간
          route_json: routePoints, // 모든 포인트 저장 (일시정지된 포인트 포함)
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

    // 통계 ref 초기화
    lastValidStatsRef.current = createInitialStats();

    // 마지막 계산한 포인트의 timestamp 초기화
    lastCalculatedTimestampRef.current = null;
  };

  // 경로 기반 통계 계산 (일시정지된 포인트 제외)
  const routeStats = useMemo((): RouteStatsOnly => {
    // 일시정지 중일 때는 계산하지 않고 이전 값 반환
    if (timer.isPaused) {
      return lastValidStatsRef.current;
    }

    // 일시정지되지 않은 포인트들만 필터링
    const activePoints = routePoints.filter((point) => !point.isPaused);

    if (activePoints.length < 2) {
      const initialStats = createInitialStats();
      lastValidStatsRef.current = initialStats;
      // 계산 상태도 초기화
      lastCalculatedTimestampRef.current = null;
      return initialStats;
    }

    // 새로운 포인트가 추가되었는지 확인
    if (lastCalculatedTimestampRef.current && activePoints.length > 0) {
      const lastCalculatedIndex = activePoints.findIndex((p) => p.timestamp === lastCalculatedTimestampRef.current);
      // 마지막 계산한 포인트가 현재 마지막 포인트와 같으면 새로운 포인트가 없음
      if (lastCalculatedIndex === activePoints.length - 1) {
        return lastValidStatsRef.current;
      }
    }

    // 증분 계산: 이전에 계산하지 않은 포인트들만 처리
    const prevStats = lastValidStatsRef.current;
    let totalDistance = prevStats.distance;
    let maxSpeed = prevStats.maxSpeed;
    let elevationGain = prevStats.elevationGain || 0;
    let elevationLoss = prevStats.elevationLoss || 0;

    // 마지막 고도는 이전에 계산된 포인트의 마지막 고도
    let lastElevation = 0;
    let startIndex = 1;

    if (lastCalculatedTimestampRef.current) {
      const lastCalculatedIndex = activePoints.findIndex((p) => p.timestamp === lastCalculatedTimestampRef.current);
      if (lastCalculatedIndex >= 0) {
        const lastCalculatedPoint = activePoints[lastCalculatedIndex];
        lastElevation = lastCalculatedPoint?.altitude || 0;
        startIndex = lastCalculatedIndex + 1;
      }
    } else {
      // 첫 번째 계산인 경우 첫 포인트의 고도
      lastElevation = activePoints[0]?.altitude || 0;
    }

    // 새로운 포인트들만 계산
    for (let i = startIndex; i < activePoints.length; i++) {
      const prev = activePoints[i - 1];
      const curr = activePoints[i];

      // 이전 포인트가 마지막 계산된 포인트와 연속적인지 확인
      const prevTimestamp = new Date(prev.timestamp).getTime();
      const currTimestamp = new Date(curr.timestamp).getTime();

      // 마지막 계산한 포인트와 현재 prev가 다르고, 그 사이에 시간 간격이 크면 새로운 구간으로 취급
      let shouldCalculateDistance = true;
      if (lastCalculatedTimestampRef.current) {
        const lastCalculatedTime = new Date(lastCalculatedTimestampRef.current).getTime();
        // 이전 포인트가 마지막 계산한 포인트와 다르면 새로운 구간
        if (prev.timestamp !== lastCalculatedTimestampRef.current) {
          shouldCalculateDistance = false; // 첫 번째 포인트는 거리 계산 안함
        }
      }

      if (shouldCalculateDistance) {
        // 거리 계산
        const segmentDistance = getDistance(prev, curr);
        totalDistance += segmentDistance;

        // 속도 계산 (시간 차이가 있는 경우)
        const timeDiff = (currTimestamp - prevTimestamp) / 1000;
        if (timeDiff > 0) {
          const segmentSpeed = segmentDistance / timeDiff;
          maxSpeed = Math.max(maxSpeed, segmentSpeed);
        }
      }

      // 고도 변화 계산 (연속성과 관계없이 수행)
      if (curr.altitude !== undefined && lastElevation !== undefined) {
        const elevationDiff = curr.altitude - lastElevation;
        if (elevationDiff > 0) {
          elevationGain += elevationDiff;
        } else {
          elevationLoss += Math.abs(elevationDiff);
        }
      }
      lastElevation = curr.altitude || lastElevation;
    }

    // 계산 상태 업데이트
    lastCalculatedTimestampRef.current = activePoints[activePoints.length - 1].timestamp;

    const durationSeconds = timer.elapsedTime / 1000;
    const avgSpeed = durationSeconds > 0 ? totalDistance / durationSeconds : 0;
    const pace = totalDistance > 0 ? (durationSeconds / (totalDistance / 1000)) : 0;

    const newStats = {
      distance: Math.round(totalDistance),
      pace: Math.round(pace),
      speed: parseFloat(avgSpeed.toFixed(2)),
      avgSpeed: parseFloat(avgSpeed.toFixed(2)),
      maxSpeed: parseFloat(maxSpeed.toFixed(2)),
      calories: Math.round((8 * 70 * (timer.elapsedTime / (1000 * 60 * 60)))),
      elevationGain: Math.round(elevationGain),
      elevationLoss: Math.round(elevationLoss),
    };

    // 계산된 값을 ref에 저장
    lastValidStatsRef.current = newStats;
    return newStats;
  }, [routePoints, timer.elapsedTime, timer.isPaused]);

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
