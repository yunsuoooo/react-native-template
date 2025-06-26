import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/shared/ui/icon';
import { ScreenLayout } from '@/shared/ui/layout';
import { PermissionChecker } from '@/shared/ui/permission';
import { RunTracker } from '@/features/run-tracking';

export const RunningScreen = () => {
  const navigation = useNavigation();

  const handlePermissionGranted = () => {
    console.log('위치 권한이 허용되었습니다.');
  };

  const handlePermissionDenied = () => {
    console.log('위치 권한이 거부되었습니다.');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenLayout>
      <View className="w-full px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <RunTracker />

      <PermissionChecker
        recheckOnFocus
        onPermissionGranted={handlePermissionGranted}
        onPermissionDenied={handlePermissionDenied}
        onGoBack={handleGoBack}
      />
    </ScreenLayout>
  );
};
