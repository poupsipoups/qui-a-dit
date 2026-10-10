import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import type { Character } from '@/features/players/types';
import { Colors } from '@/theme/tokens';

const palettes = [
  { bg: Colors.background, cheek: '#F2A9C3', line: Colors.ink },
  { bg: Colors.action, cheek: '#5F7AF7', line: Colors.white },
  { bg: Colors.anis, cheek: '#FF9EC4', line: Colors.ink },
  { bg: Colors.orange, cheek: '#E8590C', line: Colors.ink },
  { bg: Colors.sky, cheek: '#FFB3C7', line: Colors.ink },
] as const;

/** Visage tiré de l'icône de l'app : yeux blancs inclinés, grosses pupilles, joues rondes. Rogné en cercle par le parent. */
export function PlayerCharacter({ character: { kind, color } }: { character: Character }) {
  const p = palettes[color];
  const stroke = { stroke: p.line, strokeWidth: 5.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const eyes = (dx: number, dy: number) => (
    <>
      <Ellipse cx={48} cy={50} rx={11.5} ry={13.5} fill={Colors.white} transform="rotate(-9 48 50)" />
      <Ellipse cx={73} cy={50} rx={11.5} ry={13.5} fill={Colors.white} transform="rotate(9 73 50)" />
      <Ellipse cx={48 + dx} cy={50 + dy} rx={6.6} ry={8.6} fill={Colors.ink} />
      <Ellipse cx={73 + dx} cy={50 + dy} rx={6.6} ry={8.6} fill={Colors.ink} />
    </>
  );
  return (
    <Svg width="100%" height="100%" viewBox="0 0 120 120" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Circle cx={60} cy={60} r={60} fill={p.bg} />
      <Circle cx={22} cy={70} r={11} fill={p.cheek} />
      <Circle cx={98} cy={69} r={11} fill={p.cheek} />
      {kind === 0 && (
        <>
          {eyes(3.5, 1)}
          <Path d="M52 73 Q60 75 68 73" {...stroke} strokeWidth={7} />
        </>
      )}
      {kind === 1 && (
        <>
          {eyes(-3, -3)}
          <Ellipse cx={60} cy={75} rx={5} ry={6} fill={p.line} />
        </>
      )}
      {kind === 2 && (
        <>
          <Path d="M34 56 Q42 47 50 56" {...stroke} />
          <Path d="M70 56 Q78 47 86 56" {...stroke} />
          <Path d="M50 72 Q60 83 70 72" {...stroke} />
        </>
      )}
    </Svg>
  );
}
