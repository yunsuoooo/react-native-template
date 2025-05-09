import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../../shared/ui/icon';

const SettingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'android' ? insets.top : 0;

  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop }}>
      <View className="flex-row p-4 justify-between items-center">
        <View className="w-4" />
        <Text className="text-center text-2xl">Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="x" size={24} className="text-zinc-600" />
        </TouchableOpacity>
      </View>
      <View>
        <Text>Setting Menus</Text>
      </View>
    </View>
  );
};

export default SettingScreen;
