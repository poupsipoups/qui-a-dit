import { Image } from 'react-native';

export function Mascot({ size = 62 }: { size?: number }) {
  return <Image source={require('@/assets/images/app-icon.png')} style={{ width: size, height: size, borderRadius: size * 0.28 }} />;
}
