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

export const dynamic = "force-dynamic";

export default async function Home() {
  const [portfolioItems, companyInfo, services] = await Promise.all([
    getActivePortfolio(),
    getCompanyInfo(),
    getActiveServices(),
  ]);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://bjp-company-profile.vercel.app";

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
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
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
