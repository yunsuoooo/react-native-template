import { useState, useEffect, useCallback } from 'react';
import { runApi } from '../api/runApi';
import type { Run } from '../model/types';

interface UseRunHistoryOptions {
  limit?: number;
  autoLoad?: boolean;
}

interface UseRunHistoryReturn {
  runs: Run[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadRuns: () => Promise<void>;
  loadMore: () => Promise<void>;
  refreshRuns: () => Promise<void>;
  deleteRun: (id: string) => Promise<void>;
}

export function useRunHistory(options: UseRunHistoryOptions = {}): UseRunHistoryReturn {
  const { limit = 20, autoLoad = true } = options;

  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 러닝 기록 로드
  const loadRuns = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentOffset = reset ? 0 : offset;
      const newRuns = await runApi.getRuns(limit, currentOffset);

      if (reset) {
        setRuns(newRuns);
        setOffset(newRuns.length);
      } else {
        setRuns((prev) => [...prev, ...newRuns]);
        setOffset((prev) => prev + newRuns.length);
      }

      // 더 이상 로드할 데이터가 없는지 확인
      setHasMore(newRuns.length === limit);
    } catch (err) {
      console.error('러닝 기록 로드 실패:', err);
      setError('러닝 기록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  // 더 많은 데이터 로드
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadRuns(false);
  }, [hasMore, loading, loadRuns]);

  // 새로고침
  const refreshRuns = useCallback(async () => {
    setOffset(0);
    setHasMore(true);
    await loadRuns(true);
  }, [loadRuns]);

  // 러닝 기록 삭제
  const deleteRun = useCallback(async (id: string) => {
    try {
      setError(null);
      await runApi.deleteRun(id);

      // 로컬 상태에서 제거
      setRuns((prev) => prev.filter((run) => run.id !== id));
    } catch (err) {
      console.error('러닝 기록 삭제 실패:', err);
      setError('러닝 기록 삭제에 실패했습니다.');
      throw err; // UI에서 처리할 수 있도록 에러를 다시 throw
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    if (autoLoad) {
      loadRuns(true);
    }
  }, [autoLoad]); // loadRuns을 의존성에서 제거하여 무한 루프 방지

  return {
    runs,
    loading,
    error,
    hasMore,
    loadRuns: () => loadRuns(true),
    loadMore,
    refreshRuns,
    deleteRun,
  };
}
