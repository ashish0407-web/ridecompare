import { SearchForm } from "@/components/search-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <SearchForm className="container mx-auto px-4 py-8 -mt-20 relative z-10" />
        <FeaturesSection />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  )
}
