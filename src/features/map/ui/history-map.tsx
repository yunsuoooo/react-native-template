import React from 'react';
import { View } from 'react-native';
import { RouteMap } from './route-map';
import type { LocationPoint } from '@/entities/location';

interface HistoryMapProps {
  route: LocationPoint[];
  startTime?: Date;
  endTime?: Date;
  distance?: number;
  duration?: number;
  className?: string;
  onMapReady?: () => void;
}

export function HistoryMap({
  route,
  startTime,
  endTime,
  distance,
  duration,
  className = 'flex-1',
  onMapReady,
}: HistoryMapProps) {
  return (
    <View className={className}>
      <RouteMap
        route={route}
        currentLocation={null}
        showUserLocation={false}
        className="flex-1"
        onMapReady={onMapReady}
      />
    </View>
  );
}
