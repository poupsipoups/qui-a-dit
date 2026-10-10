export const Colors = {
  background: "#F6C8D5",
  ink: "#141B66",
  action: "#3D5CF0",
  actionPressed: "#2F49D0",
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
export const Type = {
  hero: { fontSize: 40, lineHeight: 44, fontWeight: "800" },
  title: { fontSize: 32, lineHeight: 38, fontWeight: "800" },
  answer: { fontSize: 26, lineHeight: 34, fontWeight: "700" },
  heading: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  body: { fontSize: 18, lineHeight: 25, fontWeight: "600" },
  label: { fontSize: 16, lineHeight: 22, fontWeight: "700" },
  caption: { fontSize: 14, lineHeight: 19, fontWeight: "600" },
} as const;
