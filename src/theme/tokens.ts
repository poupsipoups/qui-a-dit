export const Colors = {
  background: "#F6C8D5",
  ink: "#141B66",
  action: "#1236F0",
  actionPressed: "#0C28C4",
  white: "#FFFFFF",
  cream: "#FFF8EA",
  sky: "#D2EEFF",
  anis: "#B2E61A",
  orange: "#FF7A1A",
  muted: "#343C86",
  disabled: "#C9CDEF",
  onDisabled: "#343C86",
  sheet: "#FFF8EA",
  switchOff: "#8F96D6",
  hairline: "rgba(20, 27, 102, 0.18)",
  overlay: "rgba(20, 27, 102, 0.28)",
};

export const Spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 } as const;
export const Radius = { card: 28, pill: 999, photo: 999 } as const;

/** Échelle typographique unique : lisible à bout de bras sur un téléphone partagé. */
/** Une famille par graisse (polices Google : le nom porte la graisse, pas `fontWeight`). */
export const Fonts = {
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
  extrabold: "Outfit_800ExtraBold",
  caps: "Quicksand_700Bold",
} as const;

export const Type = {
  hero: { fontFamily: Fonts.extrabold, fontSize: 40, lineHeight: 44 },
  title: { fontFamily: Fonts.extrabold, fontSize: 32, lineHeight: 38 },
  answer: { fontFamily: Fonts.bold, fontSize: 26, lineHeight: 34 },
  heading: { fontFamily: Fonts.bold, fontSize: 22, lineHeight: 28 },
  body: { fontFamily: Fonts.semibold, fontSize: 18, lineHeight: 25 },
  label: { fontFamily: Fonts.bold, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: Fonts.semibold, fontSize: 14, lineHeight: 19 },
  /** Capitales espacées, police fine : consignes et boutons d'action. */
  caps: { fontFamily: Fonts.caps, fontSize: 14, lineHeight: 20, letterSpacing: 2, textTransform: "uppercase" },
} as const;
