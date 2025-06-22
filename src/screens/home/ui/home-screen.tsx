import React from 'react';
import { View, Text } from 'react-native';
import { ScreenLayout } from '@shared/ui/layout';

export const HomeScreen: React.FC = () => {
  return (
    <ScreenLayout>
      <View className="px-4 my-20">
        <Text className="text-3xl font-bold">Hi Yunsu,</Text>
        <Text className="text-3xl font-bold">Do you want</Text>
        <Text className="text-3xl font-bold">To run today?</Text>
      </View>
    </ScreenLayout>
  );
};

export default HomeScreen;
