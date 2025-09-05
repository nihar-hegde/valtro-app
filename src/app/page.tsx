import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { SocialProof } from "@/components/sections/social-proof";
import { FeatureShowcase } from "@/components/sections/feature-showcase";
import { PricingSection } from "@/components/sections/pricing-section";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<main>
				<HeroSection />
				<SocialProof />
				<FeatureShowcase />
				<PricingSection />
				<FinalCTA />
			</main>
			<Footer />
		</div>
	);
}
