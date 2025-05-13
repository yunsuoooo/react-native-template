import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppNavigation } from '../../../app/navigation/hooks/use-app-navigation';
import { Icon } from '../icon';

interface CustomDrawerContentProps extends DrawerContentComponentProps {}

const CustomDrawerContent = (props: CustomDrawerContentProps) => {
  const { goToSettings } = useAppNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* drawer header */}
      <View className="p-5 bg-gray-100 border-b border-gray-200">
        <Text>React Native Template v1</Text>
      </View>

      {/* drawer item list */}
      <ScrollView className="flex-1">
        <View className="pt-2">
          <DrawerItemList {...props} />
        </View>

        {/* additional custom menu item */}
        <View className="px-2 mt-4">
          <TouchableOpacity className="ml-3 flex-row gap-2 items-center" onPress={goToSettings}>
            <Icon name="settings" size={16} />
            <Text className="text-sm font-semibold text-gray-500">설정</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* drawer footer */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-blue-500 justify-center items-center">
            <Text className="text-white text-lg font-bold">RN</Text>
          </View>
          <View className="ml-3">
            <Text className="text-base font-bold text-gray-800">React Native</Text>
            <Text className="text-sm text-gray-600 mt-0.5">react@native.dev</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
