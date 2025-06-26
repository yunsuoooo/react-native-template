import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useRunTracker } from '@/entities/run';
import { RunTrackerStats } from './run-tracker-stats';
import { RunTrackerControls } from './run-tracker-controls';
import { LocationPoint } from '@/entities/location';

interface CurrentLocationDisplayProps {
  location: LocationPoint | null;
}

const CurrentLocationDisplay: React.FC<CurrentLocationDisplayProps> = ({ location }) => {
  if (!location) return null;

  return (
    <View className="bg-blue-50 rounded-lg p-4">
      <Text className="text-sm text-gray-600 mb-2">현재 위치</Text>
      <Text className="text-xs text-gray-500">
        위도: {location.latitude.toFixed(6)}
      </Text>
      <Text className="text-xs text-gray-500">
        경도: {location.longitude.toFixed(6)}
      </Text>
      {location.altitude && (
        <Text className="text-xs text-gray-500">
          고도: {location.altitude.toFixed(1)}m
        </Text>
      )}
      {location.accuracy && (
        <Text className="text-xs text-gray-500">
          정확도: ±{location.accuracy.toFixed(0)}m
        </Text>
      )}
    </View>
  );
};

interface DebugInfoProps {
  isTracking: boolean;
  isPaused: boolean;
  routePointsCount: number;
  totalDistance: number;
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  isTracking,
  isPaused,
  routePointsCount,
  totalDistance,
}) => {
  if (!__DEV__) return null;

  return (
    <View className="mt-8 p-4 bg-gray-100 rounded-lg">
      <Text className="text-xs text-gray-600 mb-2">디버그 정보</Text>
      <Text className="text-xs text-gray-500">
        추적 중: {isTracking ? '예' : '아니오'}
      </Text>
      <Text className="text-xs text-gray-500">
        일시정지: {isPaused ? '예' : '아니오'}
      </Text>
      <Text className="text-xs text-gray-500">
        저장된 포인트: {routePointsCount}개
      </Text>
      <Text className="text-xs text-gray-500">
        총 거리: {totalDistance.toFixed(2)}m
      </Text>
    </View>
  );
};

interface RunTrackerProps {
  onRunSaved?: (runData: any) => void;
}

export const RunTracker: React.FC<RunTrackerProps> = ({ onRunSaved }) => {
  const {
    isTracking,
    isPaused,
    currentLocation,
    routePoints,
    stats,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    resetTracking,
    error,
  } = useRunTracker({
    minDistance: 5, // 5미터 이상 이동했을 때만 기록
    updateInterval: 3000, // 3초마다 위치 업데이트
  });

  const handleStopTracking = async () => {
    try {
      await stopTracking();
      if (onRunSaved) {
        onRunSaved({ stats, routePoints });
      }
      Alert.alert('완료', '러닝 기록이 저장되었습니다!');
    } catch (err) {
      Alert.alert('오류', '러닝 기록 저장에 실패했습니다.');
    }
  };

  const handleResetTracking = () => {
    Alert.alert(
      '초기화',
      '현재 러닝 데이터를 모두 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: resetTracking },
      ],
    );
  };

  return (
    <View className="flex-1 p-4">
      {/* 러닝 통계 */}
      <View className="my-6">
        <RunTrackerStats stats={stats} />
      </View>

      {/* 현재 위치 표시 */}
      <CurrentLocationDisplay location={currentLocation} />

      {/* 컨트롤 버튼들 */}
      <RunTrackerControls
        isTracking={isTracking}
        isPaused={isPaused}
        onStart={startTracking}
        onPause={pauseTracking}
        onResume={resumeTracking}
        onStop={handleStopTracking}
        onReset={handleResetTracking}
      />

      {/* 디버그 정보 */}
      <DebugInfo
        isTracking={isTracking}
        isPaused={isPaused}
        routePointsCount={routePoints.length}
        totalDistance={stats.distance}
      />
    </View>
  );
};
