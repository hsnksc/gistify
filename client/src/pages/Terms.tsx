import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const COPY = {
  tr: {
    eyebrow: "Terms of Service",
    title: "Kullanim kosullari",
    description:
      "Bu kosullar, Gistify dijital abonelik hizmetinin kullanimi icin temel kurallari aciklar.",
    ctaLabel: "Fiyatlandirmaya don",
    sections: [
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
    ],
  },
  en: {
    eyebrow: "Terms of Service",
    title: "Terms of service",
    description:
      "These terms explain the core rules for using the Gistify digital subscription service.",
    ctaLabel: "Back to pricing",
    sections: [
      {
        title: "1. Parties and service",
        body: "This website and digital subscription service are provided by Gistify. Gistify offers web-based financial analysis screens, momentum scanning tools and pre-earnings research content.",
      },
      {
        title: "2. Account and access",
        body: "Access to the application may change from time to time for technical or operational reasons. Gistify reserves the right to improve the service, update content or modules, and suspend certain features when necessary.",
      },
      {
        title: "3. Subscription and permitted use",
        body: "The subscription is a digital access license. Users may use the service only for lawful purposes and for their own internal use. Copying, commercial redistribution or unauthorized sharing of the content is prohibited.",
      },
      {
        title: "4. Financial liability limitation",
        body: "The data and analysis provided on Gistify do not constitute investment advice. All decisions remain the responsibility of the user. Gistify cannot be held liable for direct or indirect losses arising from financial decisions made using the platform content.",
      },
      {
        title: "5. Support and contact",
        body: "Support requests related to the service may be sent to support@gistify.pro. This contact channel is also used for operational and legal notices.",
      },
    ],
  },
} as const;

export default function Terms({
  language,
  onLanguageChange,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
}) {
  const copy = COPY[language];

  return (
    <PublicShell
      language={language}
      onLanguageChange={onLanguageChange}
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      ctaHref="/pricing"
      ctaLabel={copy.ctaLabel}
    >
      <div className="space-y-4">
        {copy.sections.map(section => (
          <section
            key={section.title}
            className="rounded-xl border border-border bg-card/82 p-6 shadow-xl"
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

