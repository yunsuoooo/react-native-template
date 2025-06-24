import { useState, useRef, useEffect } from 'react';

interface UseTimerOptions {
  updateInterval?: number; // 업데이트 간격 (밀리초)
}

interface UseTimerReturn {
  // 상태
  isRunning: boolean;
  isPaused: boolean;
  elapsedTime: number; // 실제 경과 시간 (일시정지 시간 제외)
  totalElapsedTime: number; // 전체 경과 시간 (일시정지 시간 포함)
  
  // 액션
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { updateInterval = 100 } = options;

  // 상태
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // ref들
  const startTimeRef = useRef<Date | null>(null);
  const pauseStartTimeRef = useRef<Date | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 업데이트 함수
  const updateTimer = () => {
    if (!startTimeRef.current) return;

    const now = new Date().getTime();
    const totalElapsed = now - startTimeRef.current.getTime();
    
    // 현재 일시정지 중인 시간 계산
    const currentPausedTime = pauseStartTimeRef.current 
      ? now - pauseStartTimeRef.current.getTime() 
      : 0;
    
    // 실제 경과 시간 = 전체 경과 시간 - 총 일시정지 시간 - 현재 일시정지 시간
    const actualElapsed = totalElapsed - totalPausedTimeRef.current - currentPausedTime;
    setElapsedTime(Math.max(0, actualElapsed));
  };

  // 타이머 시작
  const start = () => {
    if (isRunning) return;

    startTimeRef.current = new Date();
    totalPausedTimeRef.current = 0;
    pauseStartTimeRef.current = null;
    setElapsedTime(0);
    setIsRunning(true);
    setIsPaused(false);

    // 타이머 시작
    timerIdRef.current = setInterval(updateTimer, updateInterval);
  };

  // 일시정지
  const pause = () => {
    if (!isRunning || isPaused) return;

    pauseStartTimeRef.current = new Date();
    setIsPaused(true);
  };

  // 재개
  const resume = () => {
    if (!isRunning || !isPaused || !pauseStartTimeRef.current) return;

    // 일시정지된 시간을 누적
    const pausedDuration = new Date().getTime() - pauseStartTimeRef.current.getTime();
    totalPausedTimeRef.current += pausedDuration;
    pauseStartTimeRef.current = null;
    setIsPaused(false);
  };

  // 정지
  const stop = () => {
    if (!isRunning) return;

    // 현재 일시정지 중이라면 일시정지 시간을 누적
    if (isPaused && pauseStartTimeRef.current) {
      const pausedDuration = new Date().getTime() - pauseStartTimeRef.current.getTime();
      totalPausedTimeRef.current += pausedDuration;
    }

    // 타이머 정리
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    setIsRunning(false);
    setIsPaused(false);
  };

  // 리셋
  const reset = () => {
    // 타이머 정리
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    pauseStartTimeRef.current = null;
    totalPausedTimeRef.current = 0;
  };

  // 전체 경과 시간 계산
  const totalElapsedTime = (() => {
    if (!startTimeRef.current) return 0;
    
    const now = new Date().getTime();
    return Math.max(0, now - startTimeRef.current.getTime());
  })();

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  return {
    // 상태
    isRunning,
    isPaused,
    elapsedTime,
    totalElapsedTime,
    
    // 액션
    start,
    pause,
    resume,
    stop,
    reset,
  };
} 