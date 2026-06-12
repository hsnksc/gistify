Drop daily markdown reports here when you want them to appear in the Daily Report admin flow.

How it works
- Every `*.md` file in `flow/` or its subfolders becomes one source package in `/reports-admin`.
- The admin can preview it, turn it into a draft, then publish it to `/daily-report`.
- Keep the file name stable after the first publish; published records are linked to that source key.
- Optional local images can live next to the markdown file and be referenced with normal markdown paths like `![Chart](chart-1.png)`.

Expected metadata
- `# Title` on the first heading line
- `**Tarih:** 12 Haziran 2026`
- `**Hazirlayan:** Name`
- `**Kapsam:** US equities, macro, sector rotation`
- `**Metodoloji:** Manual desk synthesis + charts`
- `## Ozet` or `## Executive Summary`

Use `flow/_template.md` as the base format for new files.
