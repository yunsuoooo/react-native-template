import { Platform } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';

export const PermissionType = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photoLibrary',
  LOCATION: 'location',
  MICROPHONE: 'microphone',
  STORAGE: 'storage',
  CONTACTS: 'contacts',
  MEDIA_LIBRARY: 'mediaLibrary',
} as const;

export type PermissionTypeKey = keyof typeof PermissionType;
export type PermissionTypeValue = (typeof PermissionType)[PermissionTypeKey];

export interface PermissionConfig {
  type: PermissionTypeValue;
  title: string;
  message: string;
  ios?: any;
  android?: any;
}

// 권한 별 설정 (메시지 및 플랫폼별 권한 정보)
export const PERMISSION_CONFIG: Record<PermissionTypeValue, PermissionConfig> = {
  [PermissionType.CAMERA]: {
    type: PermissionType.CAMERA,
    title: '카메라 접근 권한',
    message: '카메라 기능을 사용하기 위해 권한이 필요합니다.',
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  },
  [PermissionType.PHOTO_LIBRARY]: {
    type: PermissionType.PHOTO_LIBRARY,
    title: '사진 라이브러리 접근 권한',
    message: '사진을 저장하거나 불러오기 위해 권한이 필요합니다.',
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    android:
      Number(Platform.Version) >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  },
  [PermissionType.LOCATION]: {
    type: PermissionType.LOCATION,
    title: '위치 접근 권한',
    message: '위치 기반 서비스를 사용하기 위해 권한이 필요합니다.',
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  },
  [PermissionType.MICROPHONE]: {
    type: PermissionType.MICROPHONE,
    title: '마이크 접근 권한',
    message: '음성 녹음을 위해 마이크 접근 권한이 필요합니다.',
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  },
  [PermissionType.STORAGE]: {
    type: PermissionType.STORAGE,
    title: '저장소 접근 권한',
    message: '파일을 저장하기 위해 권한이 필요합니다.',
    ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    android:
      Number(Platform.Version) >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  },
  [PermissionType.CONTACTS]: {
    type: PermissionType.CONTACTS,
    title: '연락처 접근 권한',
    message: '연락처 정보에 접근하기 위해 권한이 필요합니다.',
    ios: PERMISSIONS.IOS.CONTACTS,
    android: PERMISSIONS.ANDROID.READ_CONTACTS,
  },
  [PermissionType.MEDIA_LIBRARY]: {
    type: PermissionType.MEDIA_LIBRARY,
    title: '미디어 라이브러리 권한',
    message: '미디어 파일에 접근하기 위해 권한이 필요합니다.',
    ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    android:
      Number(Platform.Version) >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  },
};

export interface PermissionResult {
  granted: boolean;
  blocked: boolean;
}
