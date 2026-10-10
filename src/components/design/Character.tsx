import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { Colors } from '@/theme/tokens';

export type CharacterBackground = 'pink' | 'blue' | 'cream' | 'anis' | 'orange';
export type Expression = 'happy' | 'curious' | 'hush' | 'thinking' | 'laugh' | 'shock' | 'love';

/** Le personnage n’a pas de corps : c’est l’écran lui-même, comme sur l’icône. Seules les joues changent de teinte. */
const palettes: Record<CharacterBackground, { cheek: string; line: string }> = {
  pink: { cheek: '#F2A9C3', line: Colors.ink },
  blue: { cheek: '#7E95F7', line: Colors.white },
  cream: { cheek: '#FFC6B8', line: Colors.ink },
  anis: { cheek: '#FF9EC4', line: Colors.ink },
  orange: { cheek: '#E8590C', line: Colors.ink },
};

const HEART = 'M0 -8 C-4 -16 -18 -12 -14 0 C-12 8 -4 14 0 18 C4 14 12 8 14 0 C18 -12 4 -16 0 -8 Z';
const TONGUE = '#FF9EC4';
const TEAR = '#BFE3FF';

/** Visage dans le style de l’icône : grands yeux blancs, pupilles qui regardent de côté, joues rondes, bouche simple. */
export function Character({ expression = 'happy', background = 'pink', size = 160 }: { expression?: Expression; background?: CharacterBackground; size?: number }) {
  const p = palettes[background];
  const stroke = { stroke: p.line, strokeWidth: 8, strokeLinecap: 'round' as const, fill: 'none' };
  const brow = { ...stroke, strokeWidth: 6 };
  const outline = background === 'cream' ? { stroke: Colors.ink, strokeWidth: 2.5 } : null;

  /** Yeux blancs de l’icône ; `look` décale les pupilles. */
  const eyes = (look: [number, number] = [4, 8]) => (
    <>
      <Ellipse cx={76} cy={62} rx={15} ry={25} fill={Colors.white} transform="rotate(-8 76 62)" {...outline} />
      <Ellipse cx={136} cy={60} rx={16} ry={25} fill={Colors.white} transform="rotate(8 136 60)" {...outline} />
      <Ellipse cx={76 + look[0]} cy={62 + look[1]} rx={9} ry={12} fill={Colors.ink} />
      <Ellipse cx={136 + look[0]} cy={60 + look[1]} rx={9.5} ry={12.5} fill={Colors.ink} />
    </>
  );
  const archedEyes = (
    <>
      <Path d="M54 74 C60 50 82 50 94 74" {...stroke} />
      <Path d="M118 72 C126 48 148 50 158 76" {...stroke} />
    </>
  );

  return (
    <Svg width={size} height={size * (150 / 210)} viewBox="0 0 210 150" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Circle cx={36} cy={104} r={15} fill={p.cheek} />
      <Circle cx={176} cy={102} r={15} fill={p.cheek} />
      {expression === 'happy' && (
        <>
          {eyes()}
          <Path d="M84 108 C92 124 120 124 128 106" {...stroke} />
        </>
      )}
      {expression === 'curious' && (
        <>
          {eyes([-4, -6])}
          <Path d="M52 30 C64 20 82 22 92 32" {...brow} />
          <Path d="M116 22 C130 10 150 14 160 28" {...brow} />
          <Ellipse cx={106} cy={112} rx={9} ry={11} fill={p.line} />
        </>
      )}
      {expression === 'hush' && (
        <>
          <Path d="M52 74 C60 56 80 56 92 72" {...stroke} />
          <Path d="M118 72 C126 54 146 56 158 74" {...stroke} />
          <Path d="M92 108 C98 118 112 118 120 106" {...stroke} />
        </>
      )}
      {expression === 'thinking' && (
        <>
          {eyes([6, -8])}
          <Path d="M118 24 C132 16 150 20 160 30" {...brow} />
          <Path d="M86 112 L126 106" {...stroke} />
        </>
      )}
      {expression === 'laugh' && (
        <>
          {archedEyes}
          <Path d="M68 96 C80 146 132 148 144 94 C118 104 94 104 68 96 Z" fill={Colors.ink} />
          <Path d="M74 98 C94 108 118 108 138 96 C136 91 130 92 128 94 C110 101 92 101 80 94 C76 93 74 95 74 98 Z" fill={Colors.white} />
          <Path d="M90 130 C98 118 124 120 128 132 C116 140 100 140 90 130 Z" fill={TONGUE} />
        </>
      )}
      {expression === 'love' && (
        <>
          <G transform="translate(76 58)"><Path d={HEART} fill="#FF5C7A" transform="scale(1.5)" /></G>
          <G transform="translate(136 56)"><Path d={HEART} fill="#FF5C7A" transform="scale(1.5)" /></G>
          <Path d="M84 104 C86 130 124 132 128 102 C112 112 98 112 84 104 Z" fill={Colors.ink} />
          <Path d="M96 120 C102 112 114 112 118 120 C112 128 102 128 96 120 Z" fill={TONGUE} />
          <Path d="M100 108 L112 108 L111 114 L101 114 Z" fill={Colors.white} />
        </>
      )}
      {expression === 'shock' && (
        <>
          {eyes([0, -6])}
          <Path d="M50 28 C62 16 80 18 92 30" {...brow} />
          <Path d="M118 30 C130 18 150 16 162 28" {...brow} />
          <Path d="M24 76 C18 90 22 100 30 94 C34 88 30 80 24 76 Z" fill={TEAR} />
          <Path d="M186 74 C192 88 188 98 180 92 C176 86 180 78 186 74 Z" fill={TEAR} />
          <Path d="M74 98 C80 144 134 146 140 96 C120 106 92 106 74 98 Z" fill={Colors.ink} />
          <Path d="M80 100 C96 108 118 108 134 98 C132 94 126 95 124 97 C108 103 94 103 84 97 C82 96 80 98 80 100 Z" fill={Colors.white} />
          <Path d="M92 130 C100 120 122 122 126 132 C116 140 102 140 92 130 Z" fill={TONGUE} />
        </>
      )}
    </Svg>
  );
}
