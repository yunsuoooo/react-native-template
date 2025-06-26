import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatSpeed,
  getRunTypeLabel,
} from '@/entities/run';
import type { Run } from '@/entities/run';

interface RunHistoryItemProps {
  run: Run;
  onPress?: (run: Run) => void;
  onDelete?: (runId: string) => void;
  className?: string;
}

export const RunHistoryItem: React.FC<RunHistoryItemProps> = ({
  run,
  onPress,
  onDelete,
  className = '',
}) => {
  const runDate = new Date(run.start_time);

  const handlePress = () => {
    onPress?.(run);
  };

  const handleDelete = () => {
    onDelete?.(run.id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 ${className}`}
    >
      {/* 헤더 */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-lg font-semibold text-gray-800">
              {formatDistance(run.distance_m)}
            </Text>
            <View className="px-2 py-1 bg-blue-100 rounded-full">
              <Text className="text-xs text-blue-600 font-medium">
                {getRunTypeLabel(run.run_type)}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-gray-500">
            {runDate.toLocaleDateString('ko-KR')} {runDate.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {onDelete && (
          <TouchableOpacity
            onPress={handleDelete}
            className="p-2 -m-2"
          >
            <Text className="text-red-500 text-sm">삭제</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 통계 */}
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-xs text-gray-400">시간</Text>
          <Text className="text-sm font-medium text-gray-700">
            {formatDuration(run.duration_ms)}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-400">페이스</Text>
          <Text className="text-sm font-medium text-gray-700">
            {run.avg_pace_s_per_km ? formatPace(run.avg_pace_s_per_km) : '--:--'}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-400">속도</Text>
          <Text className="text-sm font-medium text-gray-700">
            {run.avg_speed_ms ? formatSpeed(run.avg_speed_ms) : '0 km/h'}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-400">칼로리</Text>
          <Text className="text-sm font-medium text-gray-700">
            {run.calories_burned || 0} kcal
          </Text>
        </View>
      </View>

      {/* 제목/메모 (있는 경우) */}
      {(run.title !== '러닝' || run.notes) && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          {run.title !== '러닝' && (
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {run.title}
            </Text>
          )}
          {run.notes && (
            <Text className="text-xs text-gray-500" numberOfLines={2}>
              {run.notes}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
