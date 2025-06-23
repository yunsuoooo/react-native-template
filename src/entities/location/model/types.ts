export interface LocationPoint {
  latitude: number;
  longitude: number;
  altitude?: number; // 고도 (미터)
  timestamp?: string; // ISO 문자열
  accuracy?: number; // 정확도 (미터)
  speed?: number; // 속도 (m/s)
  heading?: number; // 방향 (도)
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