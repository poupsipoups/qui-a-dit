import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, Path } from 'react-native-svg';

import { Colors } from '@/theme/tokens';

export type CharacterBackground = 'pink' | 'blue' | 'cream' | 'anis' | 'orange';
export type Expression = 'happy' | 'secret' | 'hush' | 'thinking' | 'laugh' | 'sad';

/** Le personnage n’a pas de corps : c’est l’écran lui-même, comme sur l’icône. Seules les joues changent de teinte. */
const palettes: Record<CharacterBackground, { cheek: string; line: string }> = {
  pink: { cheek: '#F2A9C3', line: Colors.ink },
  blue: { cheek: '#5F7AF7', line: Colors.white },
  cream: { cheek: '#FFC6B8', line: Colors.ink },
  anis: { cheek: '#FF9EC4', line: Colors.ink },
  orange: { cheek: '#E8590C', line: Colors.ink },
};

const MOUTH_LAUGH = 'M68 96 C80 146 132 148 144 94 C118 104 94 104 68 96 Z';
const TONGUE = '#FF9EC4';

/** Visage dans le style de l’icône : grands yeux blancs, pupilles qui regardent de côté, joues rondes, bouche simple. */
export function Character({ expression = 'happy', background = 'pink', size = 160 }: { expression?: Expression; background?: CharacterBackground; size?: number }) {
  const p = palettes[background];
  const stroke = { stroke: p.line, strokeWidth: 8, strokeLinecap: 'round' as const, fill: 'none' };
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
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Svg width={size} height={size * (150 / 210)} viewBox="0 0 210 150">
      <Circle cx={36} cy={104} r={15} fill={p.cheek} />
      <Circle cx={176} cy={102} r={15} fill={p.cheek} />
      {expression === 'happy' && (
        <>
          {eyes()}
          <Path d="M84 108 C92 124 120 124 128 106" {...stroke} />
        </>
      )}
      {expression === 'secret' && (
        <>
          <Defs>
            <ClipPath id="secretEyeL"><Path d="M54 64 C56 44 94 44 96 64 C94 82 58 84 54 64 Z" /></ClipPath>
            <ClipPath id="secretEyeR"><Path d="M118 64 C120 44 158 44 160 64 C158 82 122 84 118 64 Z" /></ClipPath>
          </Defs>
          <Path d="M54 64 C56 44 94 44 96 64 C94 82 58 84 54 64 Z" fill={Colors.white} />
          <Path d="M118 64 C120 44 158 44 160 64 C158 82 122 84 118 64 Z" fill={Colors.white} />
          <Ellipse cx={92} cy={66} rx={10} ry={12} fill={Colors.ink} clipPath="url(#secretEyeL)" />
          <Ellipse cx={156} cy={66} rx={10} ry={12} fill={Colors.ink} clipPath="url(#secretEyeR)" />
          <Path d="M92 108 C102 114 120 114 130 102" {...stroke} />
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
          <Path d="M86 112 L126 106" {...stroke} />
        </>
      )}
      {expression === 'laugh' && (
        <>
          <Defs><ClipPath id="mouthLaugh"><Path d={MOUTH_LAUGH} /></ClipPath></Defs>
          {archedEyes}
          <Path d={MOUTH_LAUGH} fill={Colors.ink} />
          <Path d="M60 90 L150 90 L150 108 C120 114 90 114 60 108 Z" fill={Colors.white} clipPath="url(#mouthLaugh)" />
          <Ellipse cx={106} cy={134} rx={24} ry={16} fill={TONGUE} clipPath="url(#mouthLaugh)" />
        </>
      )}
      {expression === 'sad' && (
        <>
          <Ellipse cx={76} cy={62} rx={15} ry={25} fill={Colors.white} transform="rotate(6 76 62)" />
          <Ellipse cx={136} cy={60} rx={16} ry={25} fill={Colors.white} transform="rotate(-6 136 60)" />
          <Ellipse cx={76} cy={76} rx={9} ry={12} fill={Colors.ink} />
          <Ellipse cx={136} cy={74} rx={9.5} ry={12.5} fill={Colors.ink} />
          <Path d="M82 124 C92 106 120 106 130 124" {...stroke} />
        </>
      )}
    </Svg>
    </View>
  );
}
