export interface LocationPoint {
  latitude: number;
  longitude: number;
  altitude?: number; // 고도 (미터)
  timestamp: string; // ISO 문자열 (고유 식별자 역할도 함)
  accuracy?: number; // 정확도 (미터)
  speed?: number; // 속도 (m/s)
  heading?: number; // 방향 (도)
  isPaused?: boolean; // 일시정지 중인 위치 데이터인지 여부
}

export interface LocationPermission {
  granted: boolean;
  canAskAgain?: boolean;
  blocked?: boolean;
}

export interface LocationError {
  code: number;
  message: string;
}