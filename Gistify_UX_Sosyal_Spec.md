
---

## Bölüm 12: Dinamik Tab Sistemi UX

### 12.1 Tab Navigation Patterns

| Pattern | Açıklama | Kullanım Yeri |
|---------|----------|---------------|
| **Horizontal Tab Bar** | Yatay scrollable tab bar. Aktif tab vurgulanmış. Fazla tab → scroll + "..." more menu | app, momentum, daily-report (üst) |
| **Vertical Tab List** | Solda dikey liste. Her tab: icon + title + badge (new/updated) | flow (sidebar) |
| **Tab Groups** | "Earnings", "Momentum", "Daily", "Special" grupları. Accordion/section divider | Tüm route'lar |
| **Tab Search** | Tab'lar arasında fuzzy search. Sonuçlar anlık filtrelenir | Tüm route'lar |
| **Tab Favorites** | Kullanıcı sık kullandığı tab'ları pinleyebilir | Tüm route'lar |
| **Recent Tabs** | Son açılan 5 tab. "Devam et" bölümü | Tüm route'lar |
| **Tab Badges** | Yeni (NEW), güncellenen (UPDATED), popüler (🔥), önerilen (⭐) | Tüm route'lar |

### 12.2 Tab Selection Flow

```
Kullanıcı landing → Tab görür → Hover (preview tooltip) → Click → Content load → Transition animation
```

- **Loading state**: Skeleton veya shimmer effect
- **Error state**: "İçerik yüklenemedi. Tekrar dene" butonu
- **Empty state**: Henüz içerik yok mesajı + CTA
- **First load**: Varsayılan tab otomatik seçilsin (localStorage'dan son seçim)
- **Tab switch animation**: Fade 200ms, crossfade
- **Scroll behavior**: Tab değişince scroll to top
- **Sticky header**: Tab bar scroll ederken sabit kalsın (top-0 sticky)

### 12.3 Tab Content Layout

- **Content area**: Full width, max-width 7xl, padding tutarlı
- **Breadcrumbs**: /app > Raporlar > Haziran 2026
- **Content header**: Title, date, author, tags, reading time, status badge
- **Table of contents**: Uzun MD'lerde sağ sidebar'da TOC (scroll spy)
- **Reading progress**: Üstte ince progress bar (scroll yüzdesi)

### 12.4 Admin Tab Management

- **Admin panel**: "İçerik Yönetimi" bölümü. Route bazlı tree view.
- **Drag & drop**: Tab sıralaması değiştirilebilir
- **Visibility**: Tab'ı gizle/göster (published/draft/archived)
- **Priority**: Tab öncelik ayarı (sıralama için)
- **Bulk actions**: Toplu publish, unpublish, delete
- **Preview**: Admin yeni MD'yi önce preview görsün, sonra publish etsin
- **Auto-schedule**: Belirli tarihte otomatik publish

---

## Bölüm 13: Sosyal Katman (Flow)

### 13.1 Like (Beğenme) UX

- **Heart icon**: outline → filled (animate). Pop animation (scale + bounce)
- **Count**: Beğeni sayısı. K (bin) ve M (milyon) formatı.
- **User state**: Kullanıcı beğenmiş mi? Kalp dolu/boş. Toggle.
- **Optimistic update**: Tıklanınca anında +1, API sonra onaylasın. Hata olursa -1 ve toast
- **Animation**: Like atıldığında küçük particle effect
- **Like list**: "Beğenenler" modal — avatar listesi
- **Anonim like**: Giriş yapmamış kullanıcı rate limit ile beğenebilir

### 13.2 Comment (Yorum) UX

- **Input**: Textarea, auto-expand, placeholder "Düşüncelerini paylaş..."
- **Rich text**: Bold, italic, list, link, emoji picker, mention (@user autocomplete)
- **Submit**: "Gönderiliyor..." spinner → Başarılı → Animate in
- **Threaded**: Nested replies. Max 3 level derinlik.
- **Comment card**: Avatar, user name, date, edited badge, body, actions (reply, like, edit, delete, flag)
- **Sort**: En yeni, en eski, en beğenilen, en çok yanıt alan
- **Load more**: "Daha fazla yorum göster" butonu. Infinite scroll.
- **Real-time**: Yeni yorum geldiğinde "Yeni yorum var, göster" banner
- **Notification**: Yorum yapıldığında bildirim (toast, bell icon badge)
- **Moderation**: Admin yorum silme, hide, flag. Spam filter.
- **Guest comment**: Captcha + rate limit ile giriş yapmamış kullanıcı yorum yapabilir

### 13.3 Share (Paylaşım) UX

- **Share button**: Icon (Share2). Click → popover menu
- **Platforms**: Twitter/X, LinkedIn, WhatsApp, Telegram, Email, Copy link, Native share
- **Copy link**: Clipboard, toast "Link kopyalandı!", auto-highlighted
- **Share preview**: OG tags preview. Title, description, image, URL.
- **QR code**: Share menu'de QR code seçeneği
- **Embed**: İframe ile embed etme
- **Analytics**: Referrer tracking

### 13.4 Social Activity Feed (Flow)

- **"Gündem" / "Trending"**: En popüler Flow içerikleri
- **Activity stream**: Son aktiviteler (beğeni, yorum, yeni içerik)
- **Filters**: Son 24 saat, bu hafta, bu ay, tüm zamanlar
- **User profile**: Kullanıcının beğendikleri, yorumları, paylaştıkları
- **Notification center**: Bell icon dropdown. Mark as read.

### 13.5 Gamification (Opsiyonel)

- **Reputation**: Kullanıcı puanı (yorum, beğeni, paylaşım → puan)
- **Badges**: "İlk yorum", "Top 10 yorumcu", "Viral paylaşım"
- **Leaderboard**: En aktif kullanıcılar

---

