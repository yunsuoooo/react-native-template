import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LocationPermission } from '../model/types';

/**
 * iOS에서 실제 위치 요청을 통해 Never 상태인지 확인 (보조 검증용)
 */
const verifyIOSLocationAccess = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      // 3초 내에 응답이 없으면 차단된 것으로 간주
      resolve(false);
    }, 3000);

    Geolocation.getCurrentPosition(
      () => {
        // 성공하면 권한이 있음
        clearTimeout(timeout);
        resolve(true);
      },
      (error) => {
        clearTimeout(timeout);
        // 에러가 나더라도 권한 자체는 있을 수 있음 (GPS 오프, 위치 서비스 오프 등)
        // error.code === 1 (PERMISSION_DENIED)만 권한 문제
        resolve(error.code !== 1);
      },
      {
        enableHighAccuracy: false,
        timeout: 2000,
        maximumAge: 60000, // 1분간 캐시된 위치도 허용
      },
    );
  });
};

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
        },
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

  // iOS 위치 권한 요청
  if (Platform.OS === 'ios') {
    try {
      const authorizationStatus = await Geolocation.requestAuthorization('whenInUse');
      console.log('iOS requestAuthorization result:', authorizationStatus);

      switch (authorizationStatus) {
        case 'granted':
          return { granted: true, canAskAgain: false, blocked: false };

        case 'denied':
          // denied 상태일 때는 실제 위치 요청으로 Never인지 확인
          const canAccess = await verifyIOSLocationAccess();
          if (!canAccess) {
            // 위치 요청이 즉시 실패하면 Never 상태
            return { granted: false, canAskAgain: false, blocked: true };
          }
          // 위치는 접근 가능하지만 권한은 denied면 재요청 가능한 상태
          return { granted: false, canAskAgain: true, blocked: false };

        case 'disabled':
          // 위치 서비스 자체가 꺼진 상태
          return { granted: false, canAskAgain: false, blocked: true };

        case 'restricted':
          // 제한된 상태 (부모 제어 등)
          return { granted: false, canAskAgain: false, blocked: true };

        default:
          return { granted: false, canAskAgain: true, blocked: false };
      }
    } catch (error) {
      console.warn('iOS location permission request failed:', error);
      return { granted: false, canAskAgain: true, blocked: false };
    }
  }

  return { granted: false, canAskAgain: false, blocked: false };
};

/**
 * 위치 권한 확인
 */
export const checkLocationPermission = async (): Promise<LocationPermission> => {
  if (Platform.OS === 'android') {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
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

  // iOS 위치 권한 확인
  if (Platform.OS === 'ios') {
    try {
      // requestAuthorization은 이미 권한이 있으면 현재 상태를 반환하고 다이얼로그를 표시하지 않음
      const authorizationStatus = await Geolocation.requestAuthorization('whenInUse');
      console.log('iOS checkLocationPermission result:', authorizationStatus);

      switch (authorizationStatus) {
        case 'granted':
          return { granted: true, canAskAgain: false, blocked: false };

        case 'denied':
          // denied 상태일 때는 실제 위치 요청으로 Never인지 확인
          const canAccess = await verifyIOSLocationAccess();
          if (!canAccess) {
            // 위치 요청이 즉시 실패하면 Never 상태
            return { granted: false, canAskAgain: false, blocked: true };
          }
          // 위치는 접근 가능하지만 권한은 denied면 재요청 가능한 상태
          return { granted: false, canAskAgain: true, blocked: false };

        case 'disabled':
          // 위치 서비스 자체가 꺼진 상태
          return { granted: false, canAskAgain: false, blocked: true };

        case 'restricted':
          // 제한된 상태 (부모 제어 등)
          return { granted: false, canAskAgain: false, blocked: true };

        default:
          return { granted: false, canAskAgain: true, blocked: false };
      }
    } catch (error) {
      console.warn('iOS location permission check failed:', error);
      return { granted: false, canAskAgain: true, blocked: false };
    }
  }

  return { granted: false, canAskAgain: false, blocked: false };
};
