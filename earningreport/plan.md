# Gistify Earnings Page Redesign Plan

## Context
User says "sayfa dizayn berbat" — redesign 5 earnings components from scratch.

## Stage 1 — Redesign All 5 Components
Files to rewrite in parallel batches (independent):
- Batch A: BudgetMatrix.tsx + PortfolioBuilder.tsx
- Batch B: GreeksDashboard.tsx + ActionPlan.tsx
- Batch C: ReportDownload.tsx

## Design System (ALL)
- bg-slate-900 text-white
- Accents: sky-400, emerald-400, rose-400, amber-400, purple-400
- Cards: rounded-2xl border border-white/10 bg-slate-800/50, hover:shadow-lg transition-all duration-200
- Padding: p-5 minimum, gap-4
- Lucide React icons
- i18n `copy()` function
- TypeScript @shared/earnings types
- `cn()` utility
- `panel` class
- Responsive: mobile-first

## Per-Component Specs
See user prompt for detailed design specs per component.

## Deliverables
5 rewritten .tsx files, summary of changes per file.
