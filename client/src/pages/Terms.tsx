import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const SECTIONS = [
  {
    title: "1. Taraflar ve hizmet",
    body: "Bu web sitesi ve dijital abonelik hizmeti Gistify tarafindan sunulur. Gistify, kullanicilara web tabanli finansal analiz ekranlari, momentum tarama araclari ve earnings oncesi arastirma icerigi saglar.",
  },
  {
    title: "2. Hesap ve erisim",
    body: "Uygulamaya erisim teknik veya operasyonel nedenlerle zaman zaman degisebilir. Gistify, hizmeti gelistirme, icerik veya modulleri guncelleme ve gerekirse belirli ozellikleri askiya alma hakkini sakli tutar.",
  },
  {
    title: "3. Abonelik ve kullanim",
    body: "Abonelik, dijital erisim lisansi niteligindedir. Kullanicilar hizmeti yalnizca yasal amaclarla ve kendi ic kullanimi icin kullanabilir. Icerigin kopyalanmasi, ticari olarak yeniden dagitilmasi veya izinsiz paylasimi yasaktir.",
  },
  {
    title: "4. Finansal sorumluluk siniri",
    body: "Gistify uzerindeki veriler ve analizler yatirim tavsiyesi degildir. Tum kararlar kullanicinin kendi sorumlulugundadir. Gistify, platform icerigine dayanilarak verilen finansal kararlardan dogan dogrudan veya dolayli zararlardan sorumlu tutulamaz.",
  },
  {
    title: "5. Destek ve iletisim",
    body: "Hizmetle ilgili destek talepleri support@gistify.pro adresine iletilebilir. Operasyonel ve hukuki bildirimlerde bu iletisim kanali kullanilir.",
  },
];

export default function Terms({ language }: { language: AppLanguage }) {
  return (
    <PublicShell
      language={language}
      eyebrow="Terms of Service"
      title="Kullanim kosullari"
      description="Bu kosullar, Gistify dijital abonelik hizmetinin kullanimi icin temel kurallari aciklar."
      ctaHref="/pricing"
      ctaLabel="Fiyatlandirmaya don"
    >
      <div className="space-y-4">
        {SECTIONS.map(section => (
          <section
            key={section.title}
            className="rounded-3xl border border-border bg-card/82 p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </PublicShell>
  );
}
