#!/bin/bash
set -e

cd /srv/gistify

echo "[1/4] Gistify deploy başlıyor..."

# Eğer container çalışıyorsa, durdur ve veriyi kurtar
if docker ps -q -f name=gistify | grep -q .; then
    echo "[2/4] Eski container durduruluyor, DB kurtarılıyor..."
    docker stop gistify
    docker cp gistify:/app/data/billing.sqlite /srv/gistify/data/billing.sqlite 2>/dev/null || true
    docker cp gistify:/app/data/billing.sqlite-shm /srv/gistify/data/billing.sqlite-shm 2>/dev/null || true
    docker cp gistify:/app/data/billing.sqlite-wal /srv/gistify/data/billing.sqlite-wal 2>/dev/null || true
    docker rm gistify
    echo "DB kurtarıldı."
else
    echo "[2/4] Çalışan container bulunamadı, DB kurtarma atlanıyor."
fi

# Data dizinlerini oluştur
mkdir -p /srv/gistify/data
mkdir -p /srv/gistify/midas

echo "[3/4] Container yeniden oluşturuluyor..."
docker-compose up -d

echo "[4/4] Deploy tamamlandı!"
echo "Loglar: docker logs --tail 20 gistify"
