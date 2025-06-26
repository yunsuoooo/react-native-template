import React from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRunHistory } from '@/entities/run';
import { RunHistoryItem } from './run-history-item';
import type { Run } from '@/entities/run';

interface RunHistoryListProps {
  onRunPress?: (run: Run) => void;
  className?: string;
}

export const RunHistoryList: React.FC<RunHistoryListProps> = ({
  onRunPress,
  className = '',
}) => {
  const {
    runs,
    loading,
    error,
    hasMore,
    refreshRuns,
    loadMore,
    deleteRun,
  } = useRunHistory({
    limit: 20,
    autoLoad: true,
  });

  const handleDelete = (runId: string) => {
    Alert.alert(
      '러닝 기록 삭제',
      '이 러닝 기록을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRun(runId);
            } catch (err) {
              Alert.alert('오류', '삭제에 실패했습니다.');
            }
          },
        },
      ],
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <Text className="text-gray-500 text-lg mb-2">러닝 기록이 없습니다</Text>
      <Text className="text-gray-400 text-sm text-center">
        첫 번째 러닝을 시작해보세요!
      </Text>
    </View>
  );

  const renderError = () => (
    <View className="flex-1 justify-center items-center py-12">
      <Text className="text-red-500 text-lg mb-2">오류 발생</Text>
      <Text className="text-gray-500 text-sm text-center mb-4">
        {error}
      </Text>
      <TouchableOpacity
        onPress={refreshRuns}
        className="px-4 py-2 bg-blue-500 rounded-lg"
      >
        <Text className="text-white font-medium">다시 시도</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View className="flex-1 justify-center items-center py-12">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-500 text-sm mt-2">로딩 중...</Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  };

  if (loading && runs.length === 0) {
    return (
      <View className={`flex-1 ${className}`}>
        {renderLoading()}
      </View>
    );
  }

  if (error && runs.length === 0) {
    return (
      <View className={`flex-1 ${className}`}>
        {renderError()}
      </View>
    );
  }

  return (
    <View className={`flex-1 ${className}`}>
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RunHistoryItem
            run={item}
            onPress={onRunPress}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={loading && runs.length > 0}
            onRefresh={refreshRuns}
            colors={['#3B82F6']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};
