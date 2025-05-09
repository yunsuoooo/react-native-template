import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../app/navigation/routes';

interface CustomDrawerContentProps extends DrawerContentComponentProps {}

const CustomDrawerContent = (props: CustomDrawerContentProps) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const openSettingScreen = () => {
    navigation.navigate(ROUTES.ROOT.SETTING);
  };

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
          <TouchableOpacity onPress={openSettingScreen}>
            <Text className="text-sm font-semibold text-gray-500 ml-3 mb-2">설정</Text>
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
