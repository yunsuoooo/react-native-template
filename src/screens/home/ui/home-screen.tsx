import React from 'react';
import { View, Text } from 'react-native';

export const HomeScreen: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center p-20">
      <Text className="text-2xl font-bold mb-10">홈 화면</Text>
      <Text className="text-base mb-20 text-center">React Native 앱의 네이티브 부분입니다.</Text>
    </View>
  );
};

export default HomeScreen;
