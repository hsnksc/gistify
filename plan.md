# Gistify SEO Outreach Plan

## Objective
Produce a complete, actionable SEO outreach package for Gistify (gistify.pro) covering:
1. Target sites list (50+ guest post / contributor opportunities)
2. Guest post topics (10 unique, search-demand-aligned pitches)
3. Outreach email templates (3 sequences × 3 emails + 1 Turkish variant)
4. HARO / digital PR strategy (source profile, query categories, rapid-response template, PR angle cheat sheet)

## Skill Selection
- **deep-research-swarm**: Stage 1 — Research guest post sites, HARO alternatives, search demand signals, competitor backlink profiles.
- **report-writing**: Stage 2 — Draft the full outreach package with structure, tone, and actionable depth.
- **copywriting**: Stage 3 — Polish outreach templates for persuasion, spam-score minimization, and CTA clarity.

## Stage 1 — Research (deep-research-swarm)
Load `deep-research-swarm`.
- Sub-agent A: Research 50+ finance/trading/options/fintech sites that accept guest posts. Collect: name, URL, niche, DA estimate, guidelines URL, contact method, pitch angle for Gistify.
- Sub-agent B: Research HARO, Qwoted, Terkel, SourceBottle, and journalist query platforms. Build rapid-response framework.
- Sub-agent C: Research 10 fresh guest post topics with search demand (Google Trends, Ahrefs/SEMrush surrogate signals, Reddit/Quora question volume). Validate uniqueness vs. existing Gistify content.
- Cross-validate findings.
- Output: `research_brief.md`

## Stage 2 — Writing (report-writing)
Load `report-writing`.
- Read `research_brief.md`.
- Produce the final outreach package in markdown:
  - `target-sites.md` (50+ sites as markdown table)
  - `guest-post-topics.md` (10 topics with metadata)
  - `outreach-templates.md` (3 sequences × cold + FU1 + FU2, plus 1 Turkish variant)
  - `haro-pr.md` (source profile, query categories, rapid-response template, PR angle cheat sheet)
- Assemble into `GISTIFY_SEO_OUTREACH.md`.

## Stage 3 — Quality & Polish (copywriting)
Load `copywriting`.
- Review all templates for spam triggers, persuasion, CTA clarity.
- Ensure every recommendation ties back to Gistify's actual product (earnings IV crush, Midas momentum, 0DTE, macro calendar, VWAP/gap fade, 5 pillar posts, 2 tools, 3 TR articles).
- Verify Turkish references are natural and limited to Turkish-market outreach.
- Finalize and deliver.

## Output
Single comprehensive markdown file: `GISTIFY_SEO_OUTREACH.md`
