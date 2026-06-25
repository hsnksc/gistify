import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const COPY = {
  tr: {
    eyebrow: "Privacy Policy",
    title: "Gizlilik politikasi",
    description:
      "Bu sayfa, Gistify tarafindan islenen temel kullanici verilerinin ne amacla kullanildigini genel hatlariyla aciklar.",
    ctaLabel: "Iade politikasini incele",
    sections: [
      {
        title: "1. Toplanan veriler",
        body: "Gistify, hesap erisimi, destek iletisimi ve temel operasyon icin gerekli olan sinirli kullanici verilerini isleyebilir. Bu veriler e-posta adresi, hesap bilgileri ve teknik oturum verilerini icerebilir.",
      },
      {
        title: "2. Veri kullanimi",
        body: "Toplanan veriler; hesaba erisim saglamak, hizmeti surdurmek, odeme ve destek sureclerini yonetmek ve guvenlik takibi yapmak amaclariyla kullanilir.",
      },
      {
        title: "3. Ucuncu taraf hizmetler",
        body: "Odeme, kimlik dogrulama veya barindirma gibi belirli sureclerde ucuncu taraf saglayicilar kullanilabilir. Bu taraflar yalnizca kendi hizmetlerini yerine getirmek icin gerekli olan veriye erisebilir.",
      },
      {
        title: "4. Veri saklama ve guvenlik",
        body: "Gistify, verileri makul teknik ve organizasyonel onlemlerle korumayi hedefler. Bununla birlikte internet uzerinden iletim tamamen risksiz olarak garanti edilemez.",
      },
      {
        title: "5. Iletisim",
        body: "Gizlilikle ilgili sorular ve talepler support@gistify.pro adresine iletilebilir.",
      },
    ],
  },
  en: {
    eyebrow: "Privacy Policy",
    title: "Privacy policy",
    description:
      "This page outlines, at a high level, what user information Gistify may process and for what operational purposes.",
    ctaLabel: "Review refund policy",
    sections: [
      {
        title: "1. Data collected",
        body: "Gistify may process limited user information required for account access, support communication and basic operations. This may include an email address, account information and technical session data.",
      },
      {
        title: "2. How data is used",
        body: "Collected data is used to provide account access, operate the service, manage billing and support flows, and maintain security monitoring.",
      },
      {
        title: "3. Third-party services",
        body: "Certain functions such as billing, authentication or hosting may rely on third-party providers. These providers may access only the information necessary to deliver their part of the service.",
      },
      {
        title: "4. Data retention and security",
        body: "Gistify aims to protect data using reasonable technical and organizational measures. However, no transmission over the internet can be guaranteed to be completely risk-free.",
      },
      {
        title: "5. Contact",
        body: "Questions or requests related to privacy may be sent to support@gistify.pro.",
      },
    ],
  },
} as const;

export default function Privacy({
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
      ctaHref="/refund"
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

