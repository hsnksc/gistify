import type { AppLanguage } from "@/lib/i18n";
import PublicShell from "@/components/PublicShell";

const SECTIONS = [
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
];

export default function Privacy({ language }: { language: AppLanguage }) {
  return (
    <PublicShell
      language={language}
      eyebrow="Privacy Policy"
      title="Gizlilik politikasi"
      description="Bu sayfa, Gistify tarafindan islenen temel kullanici verilerinin ne amacla kullanildigini genel hatlariyla aciklar."
      ctaHref="/refund"
      ctaLabel="Iade politikasini incele"
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
