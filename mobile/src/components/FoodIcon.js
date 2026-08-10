import { Circle, Line, Path, Svg } from 'react-native-svg';
import { Utensils } from 'lucide-react-native';

export function FoodIcon({ visual, size, color }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', width: size, height: size };

  if (visual === 'bread') {
    return (
      <Svg {...common}>
        <Path d="M3 15c0-5 4-9 9-9s9 4 9 9" />
        <Path d="M3 15c0 2 1.3 3 3 3h12c1.7 0 3-1 3-3" />
        <Line x1="3" y1="15" x2="21" y2="15" />
        <Circle cx="9" cy="9.5" r="0.6" fill={color} stroke="none" />
        <Circle cx="12" cy="7.5" r="0.6" fill={color} stroke="none" />
        <Circle cx="15" cy="9.5" r="0.6" fill={color} stroke="none" />
      </Svg>
    );
  }
  if (visual === 'burger') {
    return (
      <Svg {...common}>
        <Path d="M4 10c0-4 3.6-7 8-7s8 3 8 7" />
        <Line x1="3" y1="10.5" x2="21" y2="10.5" />
        <Line x1="3" y1="13.5" x2="21" y2="13.5" />
        <Path d="M3 16.5h18" />
        <Path d="M3 16.5c0 2 1.3 3 3 3h12c1.7 0 3-1 3-3" />
      </Svg>
    );
  }
  if (visual === 'drink') {
    return (
      <Svg {...common}>
        <Path d="M7 8h10l-1.1 11.5A2 2 0 0 1 13.9 21h-3.8a2 2 0 0 1-2-1.5L7 8Z" />
        <Path d="M6 8h12" />
        <Path d="M14 8V3" />
        <Path d="M14 3h3" />
      </Svg>
    );
  }
  if (visual === 'vegetable') {
    return (
      <Svg {...common}>
        <Path d="M5 19c-2-6 1-13 8-15 3 5 3 12-2 15-2 1-4 1-6 0Z" />
        <Path d="M6 18c3-4 6-7 11-13" />
      </Svg>
    );
  }
  return <Utensils size={size} color={color} />;
}
