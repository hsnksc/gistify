export const THEME = {
  shellClassName:
    "border-emerald-500/20 bg-[linear-gradient(180deg,rgba(9,29,18,0.96),rgba(8,16,12,0.98))]",
  innerClassName:
    "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_32%),linear-gradient(180deg,rgba(10,24,18,0.94),rgba(8,16,12,0.98))]",
  cardClassName: "border-emerald-500/18 bg-emerald-500/[0.07]",
  softCardClassName: "border-emerald-500/16 bg-emerald-500/[0.06]",
  glowClassName: "from-emerald-400/16 via-emerald-500/0 to-transparent",
  iconClassName: "text-emerald-200",
  eyebrowClassName: "text-emerald-300",
  lineClassName: "bg-emerald-400/70",
};

export const THEME_BY_IMPORTANCE = {
  high: {
    cardClassName: "border-rose-500/20 bg-rose-500/[0.07]",
    glowClassName: "from-rose-400/16 via-rose-500/0 to-transparent",
    iconClassName: "text-rose-200",
    rowClassName: "bg-rose-500/[0.04]",
    accentBorder: "border-l-rose-500/60",
    badgeBg: "bg-rose-500/15",
    badgeText: "text-rose-200",
    badgeBorder: "border-rose-500/30",
  },
  medium: {
    cardClassName: "border-amber-500/20 bg-amber-500/[0.07]",
    glowClassName: "from-amber-400/16 via-amber-500/0 to-transparent",
    iconClassName: "text-amber-200",
    rowClassName: "bg-amber-500/[0.03]",
    accentBorder: "border-l-amber-500/50",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-200",
    badgeBorder: "border-amber-500/30",
  },
  low: {
    cardClassName: "border-emerald-500/18 bg-emerald-500/[0.07]",
    glowClassName: "from-emerald-400/16 via-emerald-500/0 to-transparent",
    iconClassName: "text-emerald-200",
    rowClassName: "",
    accentBorder: "border-l-emerald-500/30",
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-300",
    badgeBorder: "border-slate-500/25",
  },
};

