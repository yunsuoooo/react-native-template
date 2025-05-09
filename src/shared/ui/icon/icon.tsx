import { cssInterop } from 'nativewind';
import FeatherIcon from 'react-native-vector-icons/Feather';

import type { FeatherIconName } from './icon.types';

interface CustomIconProps {
  name: FeatherIconName;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * FeatherIcon 컴포넌트
 * @param name - 아이콘
 * @param size - 아이콘 크기
 * @param className - 아이콘 색상 적용
 * @param color - 입력 X (only css interop)
 * @returns FeatherIcon 컴포넌트
 */
const IconComponent = ({ name, size = 20, color = 'black', ...rest }: CustomIconProps) => {
  return <FeatherIcon name={name} size={size} color={color} {...rest} />;
};

const CustomIcon = cssInterop(IconComponent, {
  className: {
    target: false,
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

export default CustomIcon;
