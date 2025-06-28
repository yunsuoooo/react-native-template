import React, { forwardRef, useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import type { LocationPoint } from '@/entities/location';

interface RouteMapProps {
  route: LocationPoint[];
  currentLocation?: LocationPoint | null;
  showUserLocation?: boolean;
  className?: string;
  onMapReady?: () => void;
}

export const RouteMap = forwardRef<MapView, RouteMapProps>(({
  route,
  currentLocation,
  showUserLocation = true,
  className = 'flex-1',
  onMapReady,
}, ref) => {

  // 지도 중심점과 델타 계산
  const mapRegion = useMemo(() => {
    if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    if (route.length > 0) {
      const lats = route.map((p) => p.latitude);
      const lngs = route.map((p) => p.longitude);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      const latDelta = (maxLat - minLat) * 1.5; // 패딩 추가
      const lngDelta = (maxLng - minLng) * 1.5;

      return {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lngDelta, 0.01),
      };
    }

    // 기본값 (서울)
    return {
      latitude: 37.5665,
      longitude: 126.9780,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [currentLocation, route]);

  // 경로 좌표 변환
  const routeCoordinates = useMemo(() => {
    return route.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    }));
  }, [route]);

  return (
    <View className={className} style={styles.container}>
      <MapView
        ref={ref}
        style={styles.map}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={true}
        onMapReady={onMapReady}
        mapType="standard"
      >
        {/* 경로 라인 표시 */}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#3B82F6" // blue-500
            strokeWidth={4}
            lineJoin="round"
            lineCap="round"
          />
        )}

        {/* 시작점 마커 */}
        {route.length > 0 && (
          <Marker
            coordinate={{
              latitude: route[0].latitude,
              longitude: route[0].longitude,
            }}
            title="시작점"
            description="러닝 시작 지점"
            pinColor="green"
          />
        )}

        {/* 끝점 마커 */}
        {route.length > 1 && (
          <Marker
            coordinate={{
              latitude: route[route.length - 1].latitude,
              longitude: route[route.length - 1].longitude,
            }}
            title="도착점"
            description="러닝 종료 지점"
            pinColor="red"
          />
        )}

        {/* 현재 위치 마커 (showUserLocation이 false일 때) */}
        {!showUserLocation && currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="현재 위치"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
