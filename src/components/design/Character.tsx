import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { Colors } from '@/theme/tokens';

export type CharacterBackground = 'pink' | 'blue' | 'cream' | 'anis' | 'orange';
export type Expression = 'happy' | 'curious' | 'hush' | 'thinking' | 'laugh' | 'shock' | 'love';

/** Teintes ton sur ton : le personnage prend la couleur de l’écran, seuls les traits ressortent. */
const palettes: Record<CharacterBackground, { body: string; cheek: string; line: string }> = {
  pink: { body: '#F2B6C9', cheek: '#F09DBA', line: Colors.ink },
  blue: { body: '#5573F5', cheek: '#7E95F7', line: Colors.white },
  cream: { body: '#FBEBD0', cheek: '#FFC6B8', line: Colors.ink },
  anis: { body: '#A3D614', cheek: '#FF9EC4', line: Colors.ink },
  orange: { body: '#F26B0A', cheek: '#E8590C', line: Colors.ink },
};

const BODY = 'M26 96 C20 44 70 10 118 16 C166 22 196 58 190 104 C184 150 148 172 104 170 C60 168 30 142 26 96 Z';
const EYE_L = 'M56 66 C54 48 76 40 86 54 C96 70 90 94 72 96 C58 97 57 80 56 66 Z';
const EYE_R = 'M120 58 C130 42 154 46 152 66 C151 84 144 98 128 94 C112 90 111 70 120 58 Z';
const CHEEK_L = 'M30 104 C30 92 48 88 56 98 C62 108 50 118 38 114 C32 112 30 108 30 104 Z';
const CHEEK_R = 'M146 102 C150 90 168 90 172 102 C174 112 162 120 152 116 C146 112 144 108 146 102 Z';
const HEART = 'M0 -8 C-4 -16 -18 -12 -14 0 C-12 8 -4 14 0 18 C4 14 12 8 14 0 C18 -12 4 -16 0 -8 Z';
const TONGUE = '#FF9EC4';

/** Petit visage organique dessiné en SVG. Le corps a la couleur du fond de l’écran. */
export function Character({ expression = 'happy', background = 'pink', size = 160 }: { expression?: Expression; background?: CharacterBackground; size?: number }) {
  const p = palettes[background];
  const stroke = { stroke: p.line, strokeWidth: 7, strokeLinecap: 'round' as const, fill: 'none' };
  const brow = { ...stroke, strokeWidth: 6 };
  const eyes = (pupilL: [number, number], pupilR: [number, number], outline = false) => (
    <>
      <Path d={EYE_L} fill={Colors.white} {...(outline ? { stroke: p.line, strokeWidth: 2.5 } : null)} />
      <Path d={EYE_R} fill={Colors.white} {...(outline ? { stroke: p.line, strokeWidth: 2.5 } : null)} />
      <Ellipse cx={pupilL[0]} cy={pupilL[1]} rx={8} ry={10} fill={Colors.ink} />
      <Ellipse cx={pupilR[0]} cy={pupilR[1]} rx={9} ry={11} fill={Colors.ink} />
    </>
  );

  return (
    <Svg width={size} height={size * (180 / 210)} viewBox="0 0 210 180" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Path d={BODY} fill={p.body} />
      <Path d={CHEEK_L} fill={p.cheek} />
      <Path d={CHEEK_R} fill={p.cheek} />
      {expression === 'happy' && (
        <>
          {eyes([78, 78], [134, 74])}
          <Path d="M82 114 C90 122 104 120 120 108" {...stroke} />
        </>
      )}
      {expression === 'curious' && (
        <>
          {eyes([72, 66], [130, 62])}
          <Path d="M50 38 C62 30 78 32 88 40" {...brow} />
          <Path d="M116 30 C130 18 148 22 158 36" {...brow} />
          <Path d="M92 112 C88 104 108 100 112 112 C114 124 96 126 92 112 Z" fill={p.line} />
        </>
      )}
      {expression === 'hush' && (
        <>
          <Path d="M54 74 C60 58 78 56 90 72" {...stroke} />
          <Path d="M114 70 C124 54 144 56 152 74" {...stroke} />
          <Path d="M90 108 C96 116 108 116 114 106" {...stroke} />
        </>
      )}
      {expression === 'thinking' && (
        <>
          {eyes([80, 60], [138, 56], background === 'cream')}
          <Path d="M116 36 C130 26 148 30 158 40" {...brow} />
          <Path d="M80 116 C92 104 108 112 126 108" {...stroke} />
        </>
      )}
      {expression === 'laugh' && (
        <>
          <Path d="M52 76 C60 52 80 54 90 76" {...stroke} />
          <Path d="M114 74 C124 50 146 54 154 78" {...stroke} />
          <Path d="M66 100 C78 146 126 150 140 98 C116 108 90 108 66 100 Z" fill={Colors.ink} />
          <Path d="M72 102 C92 111 114 111 134 101 C133 96 128 97 126 99 C108 106 90 106 78 99 C74 98 72 100 72 102 Z" fill={Colors.white} />
          <Path d="M88 132 C96 120 120 122 124 134 C112 142 96 142 88 132 Z" fill={TONGUE} />
        </>
      )}
      {expression === 'love' && (
        <>
          <G transform="translate(72 66)"><Path d={HEART} fill="#FF5C7A" /></G>
          <G transform="translate(136 62)"><Path d={HEART} fill="#FF5C7A" /></G>
          <Path d="M82 108 C84 128 120 130 124 106 C108 114 96 114 82 108 Z" fill={Colors.ink} />
          <Path d="M94 122 C100 114 110 114 114 122 C108 128 100 128 94 122 Z" fill={TONGUE} />
        </>
      )}
      {expression === 'shock' && (
        <>
          <Path d="M52 66 C50 42 78 38 88 58 C94 78 80 92 66 90 C54 88 52 76 52 66 Z" fill={Colors.white} />
          <Path d="M120 60 C126 40 152 42 152 64 C152 84 140 94 128 90 C116 86 116 72 120 60 Z" fill={Colors.white} />
          <Ellipse cx={72} cy={68} rx={5.5} ry={6.5} fill={Colors.ink} />
          <Ellipse cx={134} cy={68} rx={5.5} ry={6.5} fill={Colors.ink} />
          <Path d="M48 34 C60 22 78 24 90 34" {...brow} />
          <Path d="M116 34 C130 22 148 24 160 36" {...brow} />
          <Path d="M90 108 C86 126 98 138 108 130 C118 122 114 104 104 102 C96 100 92 104 90 108 Z" fill={Colors.ink} />
        </>
      )}
    </Svg>
  );
}
