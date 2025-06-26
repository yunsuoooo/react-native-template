import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface RunTrackerControlsProps {
  isTracking: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => Promise<void> | void;
  onReset: () => void;
  className?: string;
}

export const RunTrackerControls: React.FC<RunTrackerControlsProps> = ({
  isTracking,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  className = '',
}) => {
  return (
    <View className={`space-y-4 ${className}`}>
      {/* 메인 시작/종료 버튼 */}
      {!isTracking ? (
        <TouchableOpacity
          onPress={onStart}
          className="py-4 px-6 rounded-lg bg-green-500"
        >
          <Text className="text-white text-center text-lg font-semibold">
            러닝 시작
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onStop}
          className="py-4 px-6 rounded-lg bg-red-500"
        >
          <Text className="text-white text-center text-lg font-semibold">
            러닝 종료
          </Text>
        </TouchableOpacity>
      )}

      {/* 일시정지/재개 및 상태 버튼 */}
      {isTracking && (
        <View className="flex-row space-x-4">
          {!isPaused ? (
            <TouchableOpacity
              onPress={onPause}
              className="flex-1 py-3 px-4 rounded-lg bg-yellow-500"
            >
              <Text className="text-white text-center font-semibold">
                일시정지
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onResume}
              className="flex-1 py-3 px-4 rounded-lg bg-blue-500"
            >
              <Text className="text-white text-center font-semibold">
                재개
              </Text>
            </TouchableOpacity>
          )}

          {/* 상태 표시 */}
          <View className="flex-1 py-3 px-4 rounded-lg bg-gray-200 justify-center">
            <Text className="text-gray-700 text-center font-semibold">
              {isPaused ? '일시정지됨' : '추적 중'}
            </Text>
          </View>
        </View>
      )}

      {/* 초기화 버튼 */}
      {!isTracking && (
        <TouchableOpacity
          onPress={onReset}
          className="py-3 px-6 rounded-lg bg-gray-500"
        >
          <Text className="text-white text-center font-semibold">
            데이터 초기화
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
