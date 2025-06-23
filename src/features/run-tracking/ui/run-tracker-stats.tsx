import React from 'react';
import { View, Text } from 'react-native';
import { formatDistance, formatDuration, formatPace, formatSpeed } from '@/entities/run';
import type { RunStats } from '@/entities/run';

interface RunTrackerStatsProps {
  stats: RunStats;
  className?: string;
}

export const RunTrackerStats: React.FC<RunTrackerStatsProps> = ({
  stats,
  className = '',
}) => {
  return (
    <View className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      {/* 메인 통계 */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="items-center flex-1">
          <Text className="text-sm text-gray-600">거리</Text>
          <Text className="text-xl font-bold text-blue-600">
            {formatDistance(stats.distance)}
          </Text>
        </View>
        
        <View className="items-center flex-1">
          <Text className="text-sm text-gray-600">시간</Text>
          <Text className="text-xl font-bold text-green-600">
            {formatDuration(stats.duration)}
          </Text>
        </View>
        
        <View className="items-center flex-1">
          <Text className="text-sm text-gray-600">페이스</Text>
          <Text className="text-xl font-bold text-purple-600">
            {stats.pace > 0 ? formatPace(stats.pace) : '--:--'}
          </Text>
        </View>
      </View>

      {/* 추가 통계 */}
      <View className="flex-row justify-between items-center pt-4 border-t border-gray-200">
        <View className="items-center flex-1">
          <Text className="text-xs text-gray-500">속도</Text>
          <Text className="text-sm font-medium text-gray-700">
            {formatSpeed(stats.speed)}
          </Text>
        </View>
        
        <View className="items-center flex-1">
          <Text className="text-xs text-gray-500">칼로리</Text>
          <Text className="text-sm font-medium text-gray-700">
            {stats.calories || 0} kcal
          </Text>
        </View>
        
        <View className="items-center flex-1">
          <Text className="text-xs text-gray-500">고도 변화</Text>
          <Text className="text-sm font-medium text-gray-700">
            {stats.elevationGain ? `+${stats.elevationGain}m` : '0m'}
          </Text>
        </View>
      </View>
    </View>
  );
}; 