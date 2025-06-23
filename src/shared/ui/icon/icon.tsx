import { cssInterop } from 'nativewind';
import {
  User,
  Shapes,
  Plus,
  ChevronLeft,
} from 'lucide-react-native';

const iconMap = {
  user: User,
  shapes: Shapes,
  plus: Plus,
  'chevron-left': ChevronLeft,
} as const;

interface CustomIconProps {
  name: keyof typeof iconMap;
  size?: number;
  className?: string;
  color?: string;
}

const Icon = ({ name, color, size }: CustomIconProps) => {
  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <LucideIcon color={color} size={size} />;
};

const CustomIcon = cssInterop(Icon, {
  className: {
    target: false,
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

export default CustomIcon;
