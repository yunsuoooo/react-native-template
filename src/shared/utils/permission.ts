import { Platform } from 'react-native';
import { check, request, RESULTS, Permission, PermissionStatus } from 'react-native-permissions';
import { PermissionType, PERMISSION_CONFIG, PermissionTypeValue } from '../types/permission.types';

/**
 * Result of permission check or request
 */
export interface PermissionResult {
  granted: boolean;
  status: PermissionStatus;
  shouldShowRequestRationale?: boolean;
}

/**
 * Get the appropriate permission constant based on platform and permission type
 */
const getPermission = (type: PermissionTypeValue): Permission | undefined => {
  const config = PERMISSION_CONFIG[type];

  if (!config) {
    throw new Error(`Unknown permission type: ${type}`);
  }

  return Platform.select({
    ios: config.ios,
    android: config.android,
    default: config.android,
  }) as Permission | undefined;
};

/**
 * Map permission result to a standardized response
 */
const mapPermissionResult = (result: PermissionStatus): PermissionResult => {
  return {
    granted: result === RESULTS.GRANTED,
    status: result,
    shouldShowRequestRationale: result === RESULTS.DENIED,
  };
};

/**
 * Check if a permission is granted
 */
export const checkPermission = async (type: PermissionTypeValue): Promise<PermissionResult> => {
  try {
    const permission = getPermission(type);

    // Some permissions might not be defined for certain platforms or versions
    if (!permission) {
      return {
        granted: true, // Assume granted if permission is not applicable
        status: RESULTS.GRANTED,
        shouldShowRequestRationale: false,
      };
    }

    const result = await check(permission);
    return mapPermissionResult(result);
  } catch (error) {
    console.error(`Error checking permission: ${error}`);
    return {
      granted: false,
      status: RESULTS.UNAVAILABLE,
      shouldShowRequestRationale: false,
    };
  }
};

/**
 * Request a permission
 */
export const requestPermission = async (type: PermissionTypeValue): Promise<PermissionResult> => {
  try {
    const permission = getPermission(type);

    // Some permissions might not be defined for certain platforms or versions
    if (!permission) {
      return {
        granted: true, // Assume granted if permission is not applicable
        status: RESULTS.GRANTED,
        shouldShowRequestRationale: false,
      };
    }

    const result = await request(permission);

    return mapPermissionResult(result);
  } catch (error) {
    console.error(`Error requesting permission: ${error}`);
    return {
      granted: false,
      status: RESULTS.UNAVAILABLE,
      shouldShowRequestRationale: false,
    };
  }
};

export const checkAndRequestPermission = async (type: PermissionTypeValue): Promise<PermissionResult> => {
  const checkResult = await checkPermission(type);

  if (checkResult.granted) {
    return checkResult;
  }

  // If denied, request the permission
  if (checkResult.status === RESULTS.DENIED) {
    return await requestPermission(type);
  }

  return checkResult;
};

export default {
  checkPermission,
  requestPermission,
  checkAndRequestPermission,
  PermissionType,
};
