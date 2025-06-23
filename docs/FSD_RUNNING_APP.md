# 🏃‍♂️ FSD 기반 러닝앱 위치 기록 시스템

Feature-Sliced Design (FSD) 아키텍처로 구현된 러닝앱의 GPS 좌표 수집 및 기록 시스템입니다.

## 📁 아키텍처 구조

```
src/
├── entities/              # 비즈니스 엔티티
│   ├── location/          # 위치 관련 엔티티
│   │   ├── model/         # 타입 정의
│   │   └── lib/           # 거리 계산, 권한 관리
│   └── run/               # 러닝 관련 엔티티
│       ├── model/         # Run 타입 정의
│       ├── api/           # Supabase API
│       ├── lib/           # 유틸리티 함수
│       ├── tracking/      # use-run-tracker 훅
│       └── history/       # use-run-history 훅
├── features/              # 기능 단위 (UI만)
│   ├── run-tracking/      # 러닝 추적 UI
│   │   └── ui/            # UI 컴포넌트들
│   └── run-history/       # 러닝 기록 조회 UI
│       └── ui/            # UI 컴포넌트들
├── screens/               # 페이지 레벨
└── shared/                # 공통 유틸리티 (진짜 공통만)
    ├── config/            # 설정 (Supabase, env)
    ├── hooks/             # 공통 훅 (use-deep-linking 등)
    └── ui/                # 공통 UI 컴포넌트
```

## 🎯 주요 기능

### Entities

#### 📍 Location Entity
- **타입 정의**: `LocationPoint`, `LocationPermission`, `LocationError`
- **거리 계산**: Haversine 공식 기반 `getDistance`, `getTotalDistance`
- **권한 관리**: Android/iOS 위치 권한 요청 및 확인

#### 🏃 Run Entity
- **타입 정의**: `Run`, `RunStats`, `RunStatus`
- **API 연동**: Supabase CRUD 작업
- **유틸리티**: 통계 계산, 포맷팅 함수들
- **비즈니스 로직**: `use-run-tracker`, `use-run-history` 훅

### Features

#### 🔴 Run-Tracking Feature
```tsx
import { useRunTracker } from '@/entities/run';
import { RunTracker } from '@/features/run-tracking';

const {
  isTracking,
  isPaused,
  routeBuffer,
  currentLocation,
  totalDistance,
  elapsedTime,
  startTracking,
  stopTracking,
  pauseTracking,
  resumeTracking,
  clearRoute,
} = useRunTracker();
```

#### 📊 Run-History Feature
```tsx
import { useRunHistory } from '@/entities/run';
import { RunHistoryList } from '@/features/run-history';

const {
  runs,
  loading,
  error,
  refreshing,
  loadRuns,
  refreshRuns,
  deleteRunById,
} = useRunHistory();
```

## 🚀 사용법

### 1. 러닝 추적 화면
```tsx
import { RunTracker } from '@/features/run-tracking';

export const RunningScreen = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <RunTracker />
    </View>
  );
};
```

### 2. 러닝 기록 화면
```tsx
import { RunHistoryList } from '@/features/run-history';

export const RunHistoryScreen = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <RunHistoryList onRunPress={handleRunPress} />
    </View>
  );
};
```

## ⚙️ 설정 요구사항

### 1. 환경 변수
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### 2. 패키지 설치
```bash
pnpm add react-native-geolocation-service @supabase/supabase-js
```

### 3. Android 권한
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### 4. iOS 권한
```xml
<!-- ios/pacee/Info.plist -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>러닝 경로를 기록하기 위해 위치 권한이 필요합니다.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>러닝 경로를 기록하기 위해 위치 권한이 필요합니다.</string>
```

### 5. Supabase 테이블
```sql
create table runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  start_time timestamp,
  end_time timestamp,
  distance_m integer,
  route_json jsonb,
  created_at timestamp default now()
);
```

### 6. iOS Pod 설치
```bash
cd ios && pod install
```

## 📦 데이터 구조

### LocationPoint
```typescript
interface LocationPoint {
  lat: number;    // 위도
  lng: number;    // 경도
  ts: number;     // 타임스탬프 (밀리초)
}
```

### Run
```typescript
interface Run {
  id?: string;
  user_id?: string;
  start_time: string;
  end_time: string;
  distance_m: number;
  route_json: LocationPoint[];
  created_at?: string;
}
```

### 저장 예시
```json
{
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T10:30:00Z",
  "distance_m": 5000,
  "route_json": [
    { "lat": 37.123, "lng": 127.456, "ts": 1710000000000 },
    { "lat": 37.128, "lng": 127.459, "ts": 1710000004000 }
  ]
}
```

## 🎨 FSD 장점

### 1. 관심사 분리
- **Entities**: 순수한 비즈니스 로직 (훅, API, 유틸리티)
- **Features**: UI 중심의 사용자 기능 (컴포넌트만)
- **Shared**: 진짜 공통인 것만 (config, 범용 hooks, UI)

### 2. 확장성
- 새로운 기능 추가 시 `features/` 디렉토리에 독립적으로 구현
- 엔티티는 여러 피처에서 재사용 가능

### 3. 테스트 용이성
- 각 레이어별로 독립적인 테스트 가능
- 의존성이 명확하게 분리됨

### 4. 유지보수성
- 기능별로 코드가 분리되어 있어 유지보수 용이
- 임포트 경로로 의존성 방향 확인 가능

## 🔧 핵심 로직

### 5m 필터링
```typescript
const distance = getDistanceBetweenPoints(lastLocation, newLocation);
if (distance >= 5) {
  // 5m 이상 이동했을 때만 저장
  setRouteBuffer(prev => [...prev, newLocation]);
}
```

### 실시간 거리 계산
```typescript
const handleLocationUpdate = (newLocation) => {
  if (distance >= 5) {
    setRouteBuffer(prev => {
      const newRoute = [...prev, newLocation];
      setTotalDistance(getTotalDistance(newRoute));
      return newRoute;
    });
  }
};
```

### 일시정지 지원
```typescript
const pauseTracking = () => {
  setIsPaused(true);
  // GPS는 계속 받되, 좌표 저장은 중단
  if (elapsedTimerRef.current) {
    clearInterval(elapsedTimerRef.current);
  }
};
```

### 경과 시간 추적
```typescript
const updateElapsedTime = useCallback(() => {
  if (startTimeRef.current && !isPaused) {
    setElapsedTime(Date.now() - startTimeRef.current.getTime());
  }
}, [isPaused]);
```

## 🎯 향후 확장 가능성

- `features/route-visualization/` - 지도 시각화
- `features/run-analysis/` - 러닝 분석
- `features/social-sharing/` - 소셜 공유
- `entities/user/` - 사용자 관리
- `entities/achievement/` - 성취 시스템

## ✅ 구현 완료된 기능들

- ✅ **GPS 좌표 실시간 수집**: `react-native-geolocation-service` 사용
- ✅ **5m 필터링**: 이전 위치와 5m 이상 떨어진 경우에만 좌표 저장
- ✅ **거리 계산**: Haversine 공식으로 정확한 거리 측정
- ✅ **Supabase 저장**: 러닝 종료 시 route_json으로 JSONB 저장
- ✅ **권한 관리**: Android/iOS 위치 권한 자동 요청
- ✅ **일시정지/재개**: GPS는 계속 받되 좌표 저장 제어
- ✅ **실시간 통계**: 거리, 시간, 포인트 수 실시간 표시
- ✅ **러닝 기록 조회**: 과거 러닝 기록 목록 및 상세 정보
- ✅ **FSD 아키텍처**: 완벽한 관심사 분리
- ✅ **kebab-case**: 모든 파일명 통일

FSD 구조로 구현되어 각 기능을 독립적으로 개발하고 테스트할 수 있습니다! 🚀 