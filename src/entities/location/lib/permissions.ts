import { Platform, PermissionsAndroid } from 'react-native';
import { LocationPermission } from '../model/types';

/**
 * 위치 권한 요청
 */
export const requestLocationPermission = async (): Promise<LocationPermission> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: '러닝 경로를 기록하기 위해 위치 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '취소',
          buttonPositive: '허용',
        }
      );
      
      return {
        granted: granted === PermissionsAndroid.RESULTS.GRANTED,
        canAskAgain: granted !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
        blocked: granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
      };
    } catch (err) {
      console.warn(err);
      return { granted: false, canAskAgain: true, blocked: false };
    }
  }
  
  // iOS는 Info.plist에서 관리
  return { granted: true, canAskAgain: false, blocked: false };
};

/**
 * 위치 권한 확인
 */
export const checkLocationPermission = async (): Promise<LocationPermission> => {
  if (Platform.OS === 'android') {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      return {
        granted: hasPermission,
        canAskAgain: true, // Android에서는 일반적으로 재요청 가능
        blocked: false, // check만으로는 blocked 상태를 정확히 알 수 없음
      };
    } catch (err) {
      console.warn(err);
      return { granted: false, canAskAgain: true, blocked: false };
    }
  }
  
  return { granted: true, canAskAgain: false, blocked: false };
}; 