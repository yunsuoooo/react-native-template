import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, Linking, AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { requestLocationPermission, checkLocationPermission } from '@/entities/location/lib/permissions';
import { LocationPermission } from '@/entities/location/model/types';
import { Icon } from '@shared/ui/icon';
import { PermissionCheckerLayout } from './permission-checker-layout';

interface PermissionCheckerProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  onGoBack?: () => void; // navigation 대신 콜백 사용
  recheckOnFocus?: boolean; // screen focus 시 권한 재체크 여부
}

export const PermissionChecker: React.FC<PermissionCheckerProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  onGoBack,
  recheckOnFocus = false,
}) => {
  const [permission, setPermission] = useState<LocationPermission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkPermissions = async () => {
    setIsLoading(true);
    try {
      const permissionStatus = await checkLocationPermission();
      console.log('checkPermissionStatus', permissionStatus);
      setPermission(permissionStatus);

      if (permissionStatus.granted) {
        onPermissionGranted?.();
      } else {
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      setPermission({ granted: false, canAskAgain: true, blocked: false });
    } finally {
      setIsLoading(false);
    }
  };

  // screen이 focus될 때마다 권한 재체크 (옵션)
  useFocusEffect(
    React.useCallback(() => {
      if (recheckOnFocus) {
        checkPermissions();
      }
    }, [recheckOnFocus]),
  );

  // 앱이 background에서 active로 돌아올 때 권한 재체크
  useEffect(() => {
    if (!recheckOnFocus) return;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('App became active, rechecking permissions...');
        checkPermissions();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [recheckOnFocus]);

  const requestPermissions = async () => {
    if (isChecking) return; // 중복 요청 방지

    setIsChecking(true);
    try {
      const permissionStatus = await requestLocationPermission();
      console.log('requestPermissionStatus', permissionStatus);
      setPermission(permissionStatus);

      if (permissionStatus.granted) {
        onPermissionGranted?.();
      } else if (permissionStatus.blocked) {
        const isIOS = Platform.OS === 'ios';
        Alert.alert(
          '권한 필요',
          isIOS ? '위치 권한이 영구적으로 차단되었습니다. 설정에서 직접 권한을 허용해주세요.' : '위치 권한이 차단되었습니다. 설정에서 직접 권한을 허용해주세요.',
          [
            { text: '취소', style: 'cancel' },
            isIOS ? { text: '설정으로 이동', onPress: openAppSettings } : { text: '확인', style: 'default' },
          ],
        );
        onPermissionDenied?.();
      } else {
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      Alert.alert('오류', '권한 요청 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  if (isLoading) {
    return (
      <PermissionCheckerLayout>
        <View className="items-center">
          <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mb-4">
            <Icon name="shield-alert" size={24} className="text-gray-600" />
          </View>
          <Text className="text-lg font-medium text-gray-800">권한 확인 중...</Text>
        </View>
      </PermissionCheckerLayout>
    );
  }

  if (!permission?.granted) {
    return (
      <PermissionCheckerLayout>
        <View className="items-center max-w-sm">
          <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-6">
            <Icon name="shield-alert" size={32} className="text-red-600" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            위치 권한이 필요합니다.
          </Text>

          <Text className="text-base text-gray-800 mb-8 text-center leading-6">
            {'러닝 경로를 기록하고 거리를 측정하기 위하여\n위치 정보 접근 권한이 필요합니다.'}
          </Text>

          {permission?.blocked ? (
            <View className="items-center w-full">
              <View className="mb-16">
                <Text className="text-gray-800 mb-2">설정으로 이동하여 다음 단계를 따라주세요.</Text>
                <Text className="text-sm text-gray-600 ml-8">1. 아래 버튼을 눌러 설정 열기</Text>
                <Text className="text-sm text-gray-600 ml-8">{Platform.OS === 'ios' ? '2. 개인정보 보호 > 위치 서비스 이동' : '2. 앱 > 권한 > 위치 이동'}</Text>
                <Text className="text-sm text-gray-600 ml-8">{Platform.OS === 'ios' ? '3. 해당 앱을 찾아서 "앱 사용 중" 선택' : '3. 위치 권한을 허용으로 변경'}</Text>
                <Text className="text-sm text-gray-600 ml-8">4. Pacee로 돌아오기</Text>
              </View>

              <View className="w-full flex-col items-center gap-2">
                <TouchableOpacity
                  className="bg-red-500 px-8 py-4 rounded-full w-full"
                  onPress={openAppSettings}
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-semibold text-base text-center">
                    설정 앱으로 이동
                  </Text>
                </TouchableOpacity>
                {onGoBack && (
                  <TouchableOpacity
                    className="px-8 py-2"
                    onPress={handleGoBack}
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-500 text-sm text-center">이전으로 돌아가기</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View className="w-full space-y-3">
              <TouchableOpacity
                className={`px-8 py-4 rounded-full w-full ${isChecking ? 'bg-gray-400' : 'bg-black'}`}
                onPress={requestPermissions}
                activeOpacity={0.7}
                disabled={isChecking}
              >
                <Text className="text-white font-semibold text-base text-center">
                  {isChecking ? '권한 요청 중...' : '권한 허용하기'}
                </Text>
              </TouchableOpacity>

              {permission?.canAskAgain && onGoBack && (
                <TouchableOpacity
                  className="px-8 py-3"
                  onPress={handleGoBack}
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-500 text-sm text-center">나중에</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </PermissionCheckerLayout>
    );
  }

  return null;
};
