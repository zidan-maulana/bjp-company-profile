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
import { getActiveServices } from "@/lib/data/services";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [portfolioItems, companyInfo, services] = await Promise.all([
    getActivePortfolio(),
    getCompanyInfo(),
    getActiveServices(),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[#0D0D0D] text-zinc-100">
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
