import React from 'react';
import { View } from 'react-native';
import { RouteMap } from './route-map';
import type { LocationPoint } from '@/entities/location';

interface RunTrackingMapProps {
  route: LocationPoint[];
  currentLocation?: LocationPoint | null;
  isTracking?: boolean;
  followUser?: boolean;
  className?: string;
  onMapReady?: () => void;
}

export function RunTrackingMap({
  route,
  currentLocation,
  isTracking = false,
  followUser = true,
  className = 'flex-1',
  onMapReady,
}: RunTrackingMapProps) {
  return (
    <View className={className}>
      <RouteMap
        route={route}
        currentLocation={currentLocation}
        showUserLocation={isTracking}
        className="flex-1"
        onMapReady={onMapReady}
      />
    </View>
  );
}
