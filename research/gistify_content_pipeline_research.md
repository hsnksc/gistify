# Gistify Content Pipeline Araştırma Raporu

**Tarih:** 2026-06-13
**Amaç:** Modern içerik pipeline, MDX, headless CMS ve dinamik içerik sistemleri hakkında Gistify projesi için derlenmiş bulgular.

---

## 1. Contentlayer.dev — Durum ve Alternatifler (2024)

**Claim:** Contentlayer, Stackbit'in Netlify tarafından acquire edilmesiyle sponsorluğu durdurduğundan 2023-2024 döneminde bakımı büyük ölçüde durdu; topluluk Markdownlayer ve Fumadocs gibi alternatiflere yöneldi. [^1]

| Alan | Detay |
|------|-------|
| **Source** | Maxwell Weru Blog (Replacing Contentlayer with Markdownlayer) |
| **URL** | https://maxwellweru.com/blog/2024/03/replacing-contentlayer-with-markdownlayer |
| **Date** | 2024-03-17 |
| **Excerpt** | "Contentlayer has been a popular library... However, due to its lack of maintenance and increasing number of bugs, developers are now looking for alternatives. I reached out to the maintainer and the requirement was to express interest in the GitHub repository. I decided to read through the codebase and even cloned it to get a better understanding. During the process, I discovered the code base was too complex for me to become a maintainer." |
| **Confidence** | high |

**Claim:** Contentlayer'in resmi FAQ sayfası hâlâ yayında ancak projenin sürdürülebilir finansman eksikliği nedeniyle aylık sadece bir gün allocate edilebildiği açıklandı. [^2]

| Alan | Detay |
|------|-------|
| **Source** | Contentlayer GitHub Issue #429 (State of the project) |
| **URL** | https://github.com/contentlayerdev/contentlayer/issues/429 |
| **Date** | 2023-04-24 |
| **Excerpt** | "Stackbit recently got acquired by Netlify which (at least for now) means that the sponsorship of Contentlayer has been paused... I can currently allocate one day a month to the project." |
| **Confidence** | high |

---

## 2. Astro Content Layer API (Astro 5+)

**Claim:** Astro 5.0, Content Layer API ile local Markdown/MDX dosyalarının ötesine geçip CMS, API ve database gibi herhangi bir kaynaktan type-safe content loading sunuyor; build performansı Markdown'ta 5x, MDX'te 2x hızlanıyor. [^3]

| Alan | Detay |
|------|-------|
| **Source** | Astro 5.0 Release Blog |
| **URL** | https://astro.build/blog/astro-5/ |
| **Date** | 2024-12-03 |
| **Excerpt** | "The Astro Content Layer is a new flexible and pluggable way to manage content, providing a unified, type-safe API to define, load, and access your content in your Astro project, no matter where it comes from... Astro team claims Markdown content builds up to 5x faster and MDX content up to 2x faster, with memory usage reduced by 25–50%." |
| **Confidence** | high |

**Claim:** Custom loaders ile herhangi bir API (örneğin GitHub, Notion) verisi `content.config.ts` içinde bir koleksiyon olarak tanımlanabiliyor; bu, Islands Architecture + Content Layer yaklaşımıyla zero-JS content siteler için ideal. [^4]

| Alan | Detay |
|------|-------|
| **Source** | Peerlist Blog (What's New With Astro 5) |
| **URL** | https://peerlist.io/blog/engineering/whats-new-with-astro-5 |
| **Date** | 2024-12-13 |
| **Excerpt** | "The Content Layer provides a simple, straightforward way to manage content from various sources. It offers a new pluggable function called loaders that fetch and transform data from any data source... With the new content layer, you can use the built-in loaders to load any type of content from the codebase, write your own loader function to fetch content from external APIs or CMS." |
| **Confidence** | high |

---

## 3. next-mdx-remote ve @next/mdx — Next.js App Router + MDX

**Claim:** Next.js App Router (RSC) ortamında `next-mdx-remote` artık `next-mdx-remote/rsc` export'u ile sunucu tarafında doğrudan `source` prop ile çalışıyor; serialize/render ayrımına gerek kalmıyor. [^5]

| Alan | Detay |
|------|-------|
| **Source** | next-mdx-remote npm page / GitHub |
| **URL** | https://www.npmjs.com/package/next-mdx-remote |
| **Date** | 2026-02-12 |
| **Excerpt** | "Usage of next-mdx-remote within server components, and specifically within Next.js's app directory, is supported by importing from next-mdx-remote/rsc. Previously, the serialization and render steps were separate, but going forward RSC makes this separation unnecessary. <MDXRemote /> now accepts a source prop, instead of accepting the serialized output from next-mdx-remote/serialize." |
| **Confidence** | high |

**Claim:** `@next/mdx` local dosyalardan sayfa oluşturmaya yararken, `next-mdx-remote` remote/dynamic MDX içeriği (CMS, veritabanı, GitHub) için tercih ediliyor; `next-mdx-remote-client` ise MDX v3 desteği ve App Router izolasyonu ile daha aktif bir fork sunuyor. [^6]

| Alan | Detay |
|------|-------|
| **Source** | next-mdx-remote-client GitHub |
| **URL** | https://github.com/ipikuka/next-mdx-remote-client |
| **Date** | 2026-05-29 |
| **Excerpt** | "I started to create next-mdx-remote-client in line with the mindset of @mdx-js/mdx in early 2024 considering next-mdx-remote had not been updated for a long time, and finally, a brand new package emerged. next-mdx-remote-client serves as a viable alternative to next-mdx-remote having more features." |
| **Confidence** | medium |

---

## 4. Keystatic (Thinkmill) — File-based CMS

**Claim:** Keystatic, Git-native (Markdown/YAML/JSON) bir CMS olarak Next.js, Astro ve Remix ile first-class entegrasyon sunuyor; local mode ve GitHub mode (API üzerinden commit) olmak üzere iki çalışma modu var. [^7]

| Alan | Detay |
|------|-------|
| **Source** | Keystatic Resmi Sitesi |
| **URL** | https://keystatic.com/ |
| **Date** | 2023-2024 (ongoing) |
| **Excerpt** | "A tool that makes Markdown, JSON and YAML content in your codebase editable by humans. Live edit content on GitHub or your local file system, without disrupting your existing code and workflows. Keystatic is a Thinkmill project. First-class CMS experience. Markdown & YAML/JSON based. TypeScript API. No database. Markdoc & MDX support." |
| **Confidence** | high |

**Claim:** Keystatic'in dezavantajları: content scheduling, approval workflow, native localization desteği yok; image/asset yönetimi Git repo'ya bağlı olduğundan büyük ölçekte Cloud Images (Pro plan) veya harici CDN gerektiriyor. [^8]

| Alan | Detay |
|------|-------|
| **Source** | Lucky Media Keystatic Review 2026 |
| **URL** | https://www.luckymedia.dev/insights/keystatic |
| **Date** | 2026-03-01 |
| **Excerpt** | "No native content scheduling, no approval workflows, no localization support, and all content is committed to your Git repo, which limits scale and editorial independence. Cloud Images on Pro is a genuine value add for content-heavy sites where managing image assets via Git is impractical." |
| **Confidence** | medium |

---

## 5. TinaCMS — Git-based CMS + Visual Editing

**Claim:** TinaCMS, Git-backed (Markdown/MDX/JSON) headless CMS'ler arasında tek visual in-context editing (sayfada doğrudan tıklayarak düzenleme) sunan çözüm; Next.js App Router + Pages Router için en iyi entegrasyona sahip. [^9]

| Alan | Detay |
|------|-------|
| **Source** | TinaCMS Resmi Sitesi (Next.js CMS) |
| **URL** | https://tina.io/nextjs-cms |
| **Date** | 2026-03-20 |
| **Excerpt** | "TinaCMS was built with NextJS in mind. It provides an unmatched developer workflow, with amazing visual editing capabilities that your editors will love. TinaCMS: The Ultimate CMS for Next.js. Developed with Next.js in mind, TinaCMS offers MDX support, visual editing, and the flexibility to deliver content statically or dynamically." |
| **Confidence** | high |

**Claim:** TinaCMS, Forestry.io'nun successor'u; TinaCloud (managed) veya self-hosted (Cloudflare Workers, Vercel, AWS Lambda) backend seçenekleri sunuyor; Editorial Workflow (draft, review, publish) Team Plus plan ($49/mo) ile geliyor. [^10]

| Alan | Detay |
|------|-------|
| **Source** | Lucky Media TinaCMS Review 2026 |
| **URL** | https://www.luckymedia.dev/insights/tina-cms |
| **Date** | 2026-03-01 |
| **Excerpt** | "TinaCMS is the successor to Forestry.io... The editing experience runs through either Tina Cloud, the managed backend service, or a self-hosted backend that you deploy and maintain. Tina Cloud handles authentication, the content GraphQL API, Git integration, and the Editorial Workflow feature that enables draft states and review queues." |
| **Confidence** | high |

---

## 6. Sanity.io & Strapi — Headless CMS Karşılaştırması

**Claim:** Sanity, real-time collaboration (çoklu kullanıcı eşzamanlı edit) ve code-first schema (sanity.config.ts) ile developer-experience lideri; Strapi ise MIT lisanslı self-hosted/open-source seçenek ile maliyet kontrolü sunuyor. [^11]

| Alan | Detay |
|------|-------|
| **Source** | Contra Collective (Sanity vs Contentful vs Strapi 2026) |
| **URL** | https://contracollective.com/blog/sanity-vs-contentful-vs-strapi-headless-cms-2026 |
| **Date** | 2026-05-24 |
| **Excerpt** | "Sanity is the developer-experience pick with the best structured content tooling in the market. Strapi is the open-source self-hosted option for teams that want full control over their infrastructure... Sanity provides built-in real-time collaborative editing and instant content synchronization, whereas Strapi relies on sequential editing workflows without native real-time co-editing." |
| **Confidence** | high |

**Claim:** 2026 headless CMS pazarında AI-native content workflows, real-time collaboration, edge deployment ve composable architecture temel trendler; Cosmic, Contentful, Strapi, Sanity, Prismic, Hygraph karşılaştırmasında Next.js entegrasyonu en güçlü olanlar Cosmic ve Prismic olarak öne çıkıyor. [^12]

| Alan | Detay |
|------|-------|
| **Source** | Cosmic Blog (Headless CMS Comparison 2026) |
| **URL** | https://www.cosmicjs.com/blog/headless-cms-comparison-2026-cosmic-contentful-strapi-sanity-prismic-hygraph |
| **Date** | 2026-02-05 |
| **Excerpt** | "Key trends shaping the 2026 landscape include: AI-native content workflows becoming table stakes, real-time collaboration features matching Google Docs expectations, edge deployment and global CDN performance as differentiators, composable architecture enabling best-of-breed tech stacks. Which headless CMS is best for Next.js? All six platforms work well with Next.js, but Cosmic and Prismic offer particularly strong Next.js integrations." |
| **Confidence** | medium |

---

## 7. Git-based CMS Pattern — Content as Code

**Claim:** Git-based CMS pattern'inde içerik değişiklikleri doğrudan Git commit'leri olarak kaydedilir; CI/CD pipeline (GitHub Actions) ile otomatik build, branch-based preview deploy ve PR review workflow mümkün olur. [^13]

| Alan | Detay |
|------|-------|
| **Source** | Gitana Blog (CMS Versioning Comparison) |
| **URL** | https://gitana.io/blog/cms-versioning-comparison |
| **Date** | 2025-12-29 |
| **Excerpt** | "Every content change is stored as a Git commit, enabling full version history, diffs, rollbacks, and branching. This approach aligns content operations with DevOps practices and supports advanced workflows such as parallel development and release-based publishing. A Git-based CMS is most appropriate when content is tightly coupled with code, teams are developer-heavy, and deployment is fully automated." |
| **Confidence** | high |

**Claim:** GitHub Actions ile branch-based preview deploy, content güncellemeleri için PR açıp review sonrası merge etmek, headless CMS'lerdeki webhooks yerine Git-native bir güncelleme mekanizması sağlar. [^14]

| Alan | Detay |
|------|-------|
| **Source** | GitHub Actions deploy örnekleri (Çeşitli CMS projeler) |
| **URL** | https://github.com/phiychai/turborepo-saas-starter |
| **Date** | 2025-2026 |
| **Excerpt** | "Preview Deployments - Automatic preview for PRs. Production Deploy - Deploy to production on merge to main. Multi-platform Support - Vercel, Netlify, Railway." |
| **Confidence** | medium |

---

## 8. Markdown Asset Pipeline — Görsel Upload & CDN

**Claim:** Markdown içindeki relative image path'leri, build sırasında veya runtime'da CDN URL'lerine rewrite edilebilir; Hugo örneğinde `render-image.html` template ile Cloudflare R2/S3 bucket path'leri otomatik çözülüyor. [^15]

| Alan | Detay |
|------|-------|
| **Source** | HeyKyo Blog (Cloudflare R2 Image Integration in Hugo) |
| **URL** | https://www.heykyo.com/posts/2025/05/comprehensive-guide-to-cloudflare-r2-image-integration-in-hugo/ |
| **Date** | 2025-05-11 |
| **Excerpt** | "This method allows you to use standard Markdown syntax for images, which are then automatically sourced from your Cloudflare R2 bucket... Local path starting with CDN prefix: rewrite to use cdnBaseURL. Assuming your cdnBaseURL is https://img.heykyo.com, this Markdown will be rendered in the final HTML as: <img src=\"https://img.heykyo.com/photos/landscapes/sunset.jpg\" alt=\"A picture from R2 bucket\" ... />" |
| **Confidence** | high |

**Claim:** Cloudflare R2, S3-compatible API ile zero egress fee ve otomatik edge compression sunuyor; R2 bucket'larına presigned URL ile client-side upload yapılabiliyor. [^16]

| Alan | Detay |
|------|-------|
| **Source** | Cloudflare Developers (R2 Upload Objects) |
| **URL** | https://developers.cloudflare.com/r2/objects/upload-objects/ |
| **Date** | 2026-06-08 |
| **Excerpt** | "When you need clients (browsers, mobile apps) to upload directly to R2 without proxying through your Worker, generate a presigned URL server-side and hand it to the client... For client-side uploads where users upload directly to R2 without going through your server, generate a presigned PUT URL. Your server creates the URL and the client uploads to it — no API credentials are exposed to the client." |
| **Confidence** | high |

---

## 9. Incremental Static Regeneration (ISR) — Next.js

**Claim:** Next.js App Router'da ISR, `fetch(..., { next: { revalidate: 60 } })` ile time-based ve `revalidateTag()` / `revalidatePath()` ile on-demand revalidation olarak iki modda çalışır; stale-while-revalidate pattern sayesinde kullanıcı her zaman hızlı yanıt alır. [^17]

| Alan | Detay |
|------|-------|
| **Source** | Next.js Official Docs (ISR Guide) |
| **URL** | https://nextjs.org/docs/app/guides/incremental-static-regeneration |
| **Date** | 2026-03-25 |
| **Excerpt** | "Incremental Static Regeneration (ISR) enables you to: Update static content without rebuilding the entire site. Reduce server load by serving prerendered, static pages for most requests. Ensure proper cache-control headers are automatically added to pages. Handle large amounts of content pages without long next build times. If an error is thrown while attempting to revalidate data, the last successfully generated data will continue to be served from the cache." |
| **Confidence** | high |

**Claim:** ISR, headless CMS webhook'leriyle yaygın olarak kullanılır: CMS publish event → webhook → Next.js Route Handler → `revalidateTag` / `revalidatePath`; bu sayede binlerce sayfalık sitelerde sadece etkilenen sayfalar yeniden oluşturulur. [^18]

| Alan | Detay |
|------|-------|
| **Source** | Naturaily Blog (Next.js ISR 2026) |
| **URL** | https://naturaily.com/blog/nextjs-isr |
| **Date** | 2026-01-19 |
| **Excerpt** | "A common pattern is CMS publish event → webhook → Next.js Route Handler/API route → revalidateTag or revalidatePath (App Router) or res.revalidate (Pages Router). Webhooks typically invalidate cached content by path or tag, so only affected pages are regenerated. Updates remain fast and predictable, even on large sites with thousands of pages." |
| **Confidence** | high |

---

## 10. Content Versioning & Rollback

**Claim:** Git-based CMS'ler (TinaCMS, Keystatic, CrafterCMS) içerik değişikliklerini doğal olarak Git commit'leri olarak versiyonlar; bu sayede side-by-side diff, anlık rollback ve branch-based staging mümkün olur. [^19]

| Alan | Detay |
|------|-------|
| **Source** | Gitana Blog (CMS Versioning Comparison) |
| **URL** | https://gitana.io/blog/cms-versioning-comparison |
| **Date** | 2025-12-29 |
| **Excerpt** | "CrafterCMS uses a Git-backed content repository. Every content change is stored as a Git commit, enabling full version history, diffs, rollbacks, and branching. This approach aligns content operations with DevOps practices and supports advanced workflows such as parallel development and release-based publishing." |
| **Confidence** | high |

**Claim:** API-first headless CMS'ler (Strapi, Sanity, Payload) de native versioning sunuyor; Strapi 5 Growth/Enterprise plan'da Content History ile side-by-side snapshot karşılaştırma ve tek tıkla rollback var; Payload ise field-level atomic rollback ve Git two-way sync ile en gelişmiş versiyonlama sunuyor. [^20]

| Alan | Detay |
|------|-------|
| **Source** | Strapi Blog (Content Versioning Guide) + Rwit Blog (Payload CMS Versioning) |
| **URL** | https://strapi.io/blog/content-versioning-strapi-setup + https://www.rwit.io/blog/payload-cms-content-versioning-for-developers |
| **Date** | 2025-12-11 + 2025-07-04 |
| **Excerpt** | Strapi: "Open any entry, access Content History from the menu, compare two snapshots side-by-side, and click 'Restore' to roll back—no database access required." Payload: "Payload allows developers to create custom 'branches' for content workflows... Atomic Rollbacks: Instead of restoring an entire document, you can roll back specific fields or even single-word changes." |
| **Confidence** | high |

---

## Özet ve Gistify için Çıkarımlar

| Konu | Gistify için Önem | Öneri |
|------|-------------------|-------|
| **Contentlayer** | Düşük | Proje bakımsız; Astro Content Layer veya `next-mdx-remote` tercih edilmeli. |
| **Astro Content Layer** | Yüksek | Eğer Astro 5+ kullanılacaksa custom loader + type-safe schema en iyi pratik. |
| **Next.js + MDX** | Yüksek | App Router + `next-mdx-remote/rsc` (Server Components) ile zero-client-JS static rendering mümkün. |
| **Keystatic** | Orta | Git-native, hafif CMS; teknik olmayan editörler için visual editor eksikliği var. |
| **TinaCMS** | Yüksek | Next.js + visual editing + MDX desteği en kuvvetli; Git-backed + editorial workflow. |
| **Sanity / Strapi** | Orta | API-first, dynamic content gerekiyorsa; Gistify'nin statik/MDX odaklı yapısına uygun olmayabilir. |
| **Git-based CMS Pattern** | Yüksek | Content as code, CI/CD entegrasyonu, PR review ve rollback için ideal. |
| **Asset Pipeline** | Yüksek | R2/S3 presigned upload + markdown path rewrite ile lightweight asset yönetimi sağlanabilir. |
| **ISR** | Yüksek | Next.js ile on-demand revalidation, CMS webhook entegrasyonu için kritik. |
| **Versioning** | Yüksek | Git-native zaten versiyonlama sağlar; API-first CMS seçilirse native Content History gerekli. |

---

## Kaynakça (Citations)

[^1]: Maxwell Weru, "Replacing Contentlayer with Markdownlayer," Mar 17, 2024. https://maxwellweru.com/blog/2024/03/replacing-contentlayer-with-markdownlayer
[^2]: Contentlayer GitHub Issue #429, "State of the project," Apr 24, 2023. https://github.com/contentlayerdev/contentlayer/issues/429
[^3]: Astro Blog, "Astro 5.0," Dec 3, 2024. https://astro.build/blog/astro-5/
[^4]: Peerlist Blog, "What's New With Astro 5," Dec 13, 2024. https://peerlist.io/blog/engineering/whats-new-with-astro-5
[^5]: next-mdx-remote npm, "React Server Components (RSC) & Next.js app Directory Support," Feb 12, 2026. https://www.npmjs.com/package/next-mdx-remote
[^6]: next-mdx-remote-client GitHub, "A wrapper of @mdx-js/mdx for Next.js applications," May 29, 2026. https://github.com/ipikuka/next-mdx-remote-client
[^7]: Keystatic, https://keystatic.com/
[^8]: Lucky Media, "Keystatic CMS Review 2026," Mar 1, 2026. https://www.luckymedia.dev/insights/keystatic
[^9]: TinaCMS, "TinaCMS for Next.js," Mar 20, 2026. https://tina.io/nextjs-cms
[^10]: Lucky Media, "TinaCMS Review 2026," Mar 1, 2026. https://www.luckymedia.dev/insights/tina-cms
[^11]: Contra Collective, "Sanity vs Contentful vs Strapi: Headless CMS Compared for Commerce (2026)," May 24, 2026. https://contracollective.com/blog/sanity-vs-contentful-vs-strapi-headless-cms-2026
[^12]: Cosmic Blog, "Cosmic vs Contentful vs Strapi vs Sanity vs Prismic vs Hygraph," Feb 5, 2026. https://www.cosmicjs.com/blog/headless-cms-comparison-2026-cosmic-contentful-strapi-sanity-prismic-hygraph
[^13]: Gitana Blog, "CMS Versioning Capabilities and Comparison," Dec 29, 2025. https://gitana.io/blog/cms-versioning-comparison
[^14]: GitHub phiychai/turborepo-saas-starter, CI/CD workflows. https://github.com/phiychai/turborepo-saas-starter
[^15]: HeyKyo Blog, "Comprehensive Guide to Cloudflare R2 Image Integration in Hugo," May 11, 2025. https://www.heykyo.com/posts/2025/05/comprehensive-guide-to-cloudflare-r2-image-integration-in-hugo/
[^16]: Cloudflare Developers, "Upload objects - R2," Jun 8, 2026. https://developers.cloudflare.com/r2/objects/upload-objects/
[^17]: Next.js Docs, "How to implement Incremental Static Regeneration (ISR)," Mar 25, 2026. https://nextjs.org/docs/app/guides/incremental-static-regeneration
[^18]: Naturaily Blog, "Next.js ISR: Revalidate & On-Demand Updates," Jan 19, 2026. https://naturaily.com/blog/nextjs-isr
[^19]: Gitana Blog, "CMS Versioning Capabilities and Comparison," Dec 29, 2025. https://gitana.io/blog/cms-versioning-comparison
[^20]: Strapi Blog, "Content Versioning in Strapi: A Complete Developer Guide," Dec 11, 2025. https://strapi.io/blog/content-versioning-strapi-setup; Rwit Blog, "How Payload CMS Solves Content Versioning Challenges for Developers," Jul 4, 2025. https://www.rwit.io/blog/payload-cms-content-versioning-for-developers
