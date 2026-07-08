@echo off
rem Gistify Event Watcher - otomatik yeniden baslatmali calistirici
rem Gorev Zamanlayici ile "Bilgisayar acilisinda" tetiklenecek sekilde kaydedin.
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
:loop
python event_watcher.py
echo [%date% %time%] watcher kapandi, 15 sn sonra yeniden baslatiliyor >> watcher_restart.log
timeout /t 15 /nobreak >nul
goto loop
