import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/shared/ui/icon';
import { ScreenLayout } from '@/shared/ui/layout';
import { RunTracker } from '@/features/run-tracking';

export const RunningScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenLayout>
      <View className='w-full px-4'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='chevron-left' size={24} color='black' />
        </TouchableOpacity>
      </View>
      <RunTracker />
    </ScreenLayout>
  );
}; 