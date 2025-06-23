import React from 'react';
import { View, Text } from 'react-native';
import { RunHistoryList } from '@/features/run-history';
import { Run } from '@/entities/run';

export const RunHistoryScreen = () => {
  const handleRunPress = (run: Run) => {
    // TODO: 러닝 상세 화면으로 이동
    console.log('Run pressed:', run.id);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* 헤더 */}
      <View className="bg-white px-4 py-6 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">러닝 기록</Text>
        <Text className="text-sm text-gray-500 mt-1">
          지금까지의 러닝 기록을 확인해보세요
        </Text>
      </View>

      {/* 러닝 기록 리스트 */}
      <RunHistoryList 
        onRunPress={handleRunPress} 
        className="p-4"
      />
    </View>
  );
}; 