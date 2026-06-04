#!/bin/bash
# NASDAQ Momentum Scanner — Gistify Entegrasyon Scripti
# Kullanım: bash install-scanner.sh <gistify_kok_dizin>

set -e

GISTIFY_ROOT="${1:-$(pwd)}"
SCANNER_SRC="$(dirname "$0")/client/src"

echo "=========================================="
echo "NASDAQ Scanner → Gistify Entegrasyon"
echo "=========================================="
echo ""
echo "Hedef dizin: $GISTIFY_ROOT"
echo ""

# Kontrol
if [ ! -d "$GISTIFY_ROOT/client/src" ]; then
    echo "HATA: $GISTIFY_ROOT/client/src bulunamadı!"
    echo "Doğru gistify kök dizinini argüman olarak verin:"
    echo "  bash install-scanner.sh /path/to/gistify"
    exit 1
fi

# 1. Scanner modülünü kopyala
echo "[1/4] Scanner modülü kopyalanıyor..."
mkdir -p "$GISTIFY_ROOT/client/src/scanner"
cp -r "$SCANNER_SRC/scanner/"* "$GISTIFY_ROOT/client/src/scanner/"
echo "  ✓ $(find "$SCANNER_SRC/scanner" -type f | wc -l) dosya kopyalandı"

# 2. Scanner sayfasını kopyala
echo "[2/4] Scanner sayfası kopyalanıyor..."
cp "$SCANNER_SRC/pages/Scanner.tsx" "$GISTIFY_ROOT/client/src/pages/Scanner.tsx"
echo "  ✓ pages/Scanner.tsx oluşturuldu"

# 3. App.tsx kontrolü
echo "[3/4] App.tsx kontrol ediliyor..."
APP_FILE="$GISTIFY_ROOT/client/src/App.tsx"
if [ -f "$APP_FILE" ]; then
    if grep -q 'path="/scanner"' "$APP_FILE" 2>/dev/null; then
        echo "  ⚠ /scanner route zaten mevcut, atlanıyor"
    else
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📋 App.tsx'e MANUEL olarak ekle:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1) Import satırı ekle (diğer import'ların yanına):"
        echo '   import Scanner from "@/pages/Scanner";'
        echo '   import { Radar } from "lucide-react";'
        echo ""
        echo "2) Switch/Route içine ekle:"
        echo '   <Route path="/scanner" component={Scanner} />'
        echo ""
        echo "3) Nav menüye ekle:"
        echo '   { label: translateUiText("NASDAQ Scanner", lang), href: "/scanner", icon: Radar }'
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    fi
else
    echo "  ⚠ App.tsx bulunamadı — route'u manuel ekleyin"
fi

# 4. Tamam
echo "[4/4] Kurulum tamamlandı!"
echo ""
echo "Sonraki adımlar:"
echo "  cd $GISTIFY_ROOT/client"
echo "  pnpm dev"
echo ""
echo "Tarayıcı: http://localhost:3001/scanner"
echo ""
echo "Kurulu dosyalar:"
find "$GISTIFY_ROOT/client/src/scanner" -type f | wc -l | xargs echo "  Scanner dosyası:"
echo "  Sayfa: pages/Scanner.tsx"
