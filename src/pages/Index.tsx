import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MissionSection />
      <PillarsSection />
      <ImpactSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
