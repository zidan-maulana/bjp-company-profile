import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutStorySection from "@/components/home/AboutStorySection";
import ServicesSection from "@/components/home/ServicesSection";
import BjpStandardSection from "@/components/home/BjpStandardSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import ConsultationSection from "@/components/home/ConsultationSection";
import Footer from "@/components/layout/Footer";
import { getActivePortfolio } from "@/lib/data/portfolio";
import { getCompanyInfo } from "@/lib/data/company";
import { getActiveServices, DEFAULT_SERVICES } from "@/lib/data/services";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [portfolioItems, companyInfo, services] = await Promise.all([
    getActivePortfolio(),
    getCompanyInfo(),
    getActiveServices(),
  ]);

  const baseUrl = getSiteUrl();

  const rawPhone = companyInfo?.phone || "081283840614";
  const formattedPhone = rawPhone.startsWith("+")
    ? rawPhone
    : `+62${rawPhone.replace(/^0/, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ManufacturingBusiness", "Organization"],
        "@id": `${baseUrl}/#organization`,
        name: companyInfo?.companyName || "Baruna Jaya Plastik",
        legalName: "PT Baruna Jaya Plastik",
        alternateName: ["BJP Mold", "Baruna Jaya Plastik Jakarta"],
        url: baseUrl,
        logo: `${baseUrl}/mold-tool-close.jpg`,
        image: `${baseUrl}/mold-tool-close.jpg`,
        description:
          "Pabrik dan bengkel spesialis perancangan, pembuatan, dan servis cetakan plastik presisi (Plastic Injection & Blowing Mold Maker) sejak 2001 di Kalideres, Jakarta Barat.",
        telephone: formattedPhone,
        email: companyInfo?.email || "barunajayaplastik.bjp@gmail.com",
        foundingDate: "2001",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            companyInfo?.address ||
            "Jl. Kampung Belakang RT 001/05 No. 37, depan SD 04 Kamal, Kel. Kamal",
          addressLocality: "Kalideres",
          addressRegion: "DKI Jakarta",
          postalCode: "11810",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -6.109,
          longitude: 106.7027,
        },
        hasMap:
          companyInfo?.googleMapsEmbed ||
          "https://maps.google.com/?q=Kalideres+Jakarta+Barat",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "08:00",
            closes: "17:00",
          },
        ],
        areaServed: [
          { "@type": "AdministrativeArea", name: "DKI Jakarta" },
          { "@type": "AdministrativeArea", name: "Jakarta Barat" },
          { "@type": "AdministrativeArea", name: "Tangerang" },
          { "@type": "AdministrativeArea", name: "Banten" },
          { "@type": "AdministrativeArea", name: "Bekasi" },
          { "@type": "AdministrativeArea", name: "Karawang" },
          { "@type": "Country", name: "Indonesia" },
        ],
        knowsAbout: [
          "Plastic Injection Mold",
          "Blowing Mold",
          "High Precision Tooling",
          "CNC High Speed Milling",
          "Sinker & Wire Cut EDM",
          "Baja Perkakas Stavax & DIN 1.2316",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Katalog Layanan Cetakan Plastik Presisi",
          itemListElement: (services && services.length > 0
            ? services
            : DEFAULT_SERVICES
          ).map((s, idx) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.fullDesc || s.desc || s.shortDesc,
            },
            position: idx + 1,
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Baruna Jaya Plastik",
        description:
          "Website resmi Baruna Jaya Plastik - Spesialis Fabrikasi & Servis Mold Presisi Jakarta Barat",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: ["id-ID", "en-US"],
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Berapa lama estimasi waktu pembuatan satu unit cetakan injeksi plastik?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Waktu fabrikasi umumnya berkisar antara 25 hingga 45 hari kerja tergantung pada kompleksitas desain part, jumlah cavity, dan jenis baja mold yang dipilih. Waktu ini sudah termasuk uji coba cetak pertama (T0/T1 trial) hingga sampel produk disetujui klien.",
            },
          },
          {
            "@type": "Question",
            name: "Jenis baja perkakas apa yang digunakan oleh Baruna Jaya Plastik?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Kami menggunakan baja perkakas standar industri berkualitas tinggi seperti Stavax (stainless anti karat), DIN 1.2316, NAK80, P20, dan SKD61 yang disesuaikan dengan volume produksi dan karakteristik kimia resin plastik klien.",
            },
          },
          {
            "@type": "Question",
            name: "Apakah Baruna Jaya Plastik melayani servis dan modifikasi mold lama?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ya, kami melayani servis menyeluruh termasuk rekondisi cavity/core yang aus, perbaikan sistem pendingin (cooling channel) bocor, penyesuaian dimensi part, penggantian part standard (ejector pin, bushing), dan re-polishing mold.",
            },
          },
          {
            "@type": "Question",
            name: "Di mana lokasi bengkel dan workshop Baruna Jaya Plastik?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Workshop kami berlokasi di Jl. Kampung Belakang RT 001/05 No. 37, Kamal, Kalideres, Jakarta Barat 11810. Kami melayani industri manufaktur dari wilayah Jabodetabek, Karawang, hingga seluruh Indonesia.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Layanan Cetakan Plastik",
            item: `${baseUrl}/#layanan`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Portofolio Mold",
            item: `${baseUrl}/#portofolio`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Hubungi Kami",
            item: `${baseUrl}/#kontak`,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#0D0D0D] text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HeroSection companyInfo={companyInfo} />
      <AboutStorySection companyInfo={companyInfo} />
      <ServicesSection initialServices={services} />
      <BjpStandardSection companyInfo={companyInfo} />
      <PortfolioSection initialItems={portfolioItems} />
      <ConsultationSection companyInfo={companyInfo} />
      <Footer companyInfo={companyInfo} />
    </main>
  );
}
