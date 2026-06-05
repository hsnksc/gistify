import type {
  PortfolioAssetType,
  PortfolioPosture,
  PortfolioPositionRecord,
  PortfolioStrategyAction,
} from "@shared/portfolio";

export function formatPortfolioCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function getPortfolioAssetLabel(assetType: PortfolioAssetType) {
  switch (assetType) {
    case "call":
      return "Call";
    case "put":
      return "Put";
    default:
      return "Stock";
  }
}

export function getPortfolioActionLabel(action: PortfolioStrategyAction) {
  switch (action) {
    case "add":
      return "Add";
    case "hold":
      return "Hold";
    case "trim":
      return "Trim";
    case "hedge":
      return "Hedge";
    case "exit":
      return "Exit";
    default:
      return "Watch";
  }
}

export function getPortfolioActionClasses(action: PortfolioStrategyAction) {
  switch (action) {
    case "add":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
    case "hold":
      return "border-cyan-400/30 bg-cyan-500/10 text-cyan-200";
    case "trim":
      return "border-amber-400/30 bg-amber-500/10 text-amber-200";
    case "hedge":
      return "border-orange-400/30 bg-orange-500/10 text-orange-200";
    case "exit":
      return "border-rose-400/30 bg-rose-500/10 text-rose-200";
    default:
      return "border-slate-400/30 bg-slate-500/10 text-slate-200";
  }
}

export function getPortfolioPostureLabel(posture: PortfolioPosture) {
  switch (posture) {
    case "aggressive":
      return "Aggressive";
    case "defensive":
      return "Defensive";
    default:
      return "Balanced";
  }
}

export function getPortfolioPostureClasses(posture: PortfolioPosture) {
  switch (posture) {
    case "aggressive":
      return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
    case "defensive":
      return "border-rose-400/25 bg-rose-500/10 text-rose-200";
    default:
      return "border-cyan-400/25 bg-cyan-500/10 text-cyan-200";
  }
}

export function getPortfolioPositionCostBasis(position: PortfolioPositionRecord) {
  const multiplier = position.assetType === "stock" ? 1 : 100;
  return position.quantity * position.entryPrice * multiplier;
}
