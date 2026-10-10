export const Colors = {
  background: "#F6C8D5",
  ink: "#19171B",
  berry: "#633A5A",
  berryPressed: "#4C2944",
  white: "#FFFFFF",
  yellow: "#FBEC9D",
  mint: "#CDF58F",
  lavender: "#E3D4FF",
  muted: "#664B5C",
  disabled: "#D6BCC6",
  onDisabled: "#5E4455",
  sheet: "#FFF7FA",
  switchOff: "#8F7A86",
  hairline: "rgba(99, 58, 90, 0.18)",
  overlay: "rgba(39, 35, 41, 0.28)",
};

export const Spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 } as const;
export const Radius = { card: 28, pill: 999, photo: 999 } as const;

/** Échelle typographique unique : lisible à bout de bras sur un téléphone partagé. */
export const Type = {
  hero: { fontSize: 40, lineHeight: 44, fontWeight: "800" },
  title: { fontSize: 32, lineHeight: 38, fontWeight: "800" },
  answer: { fontSize: 26, lineHeight: 34, fontWeight: "700" },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  body: { fontSize: 18, lineHeight: 25, fontWeight: "600" },
  label: { fontSize: 16, lineHeight: 22, fontWeight: "700" },
  caption: { fontSize: 14, lineHeight: 19, fontWeight: "600" },
} as const;
