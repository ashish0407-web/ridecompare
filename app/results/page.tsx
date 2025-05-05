import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ResultsMap } from "@/components/results-map"
import { RideComparisonList } from "@/components/ride-comparison-list"
import { FilterBar } from "@/components/filter-bar"
import { SearchBar } from "@/components/search-bar"

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <SearchBar className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FilterBar />
          </div>
          <div className="lg:col-span-2">
            <ResultsMap className="h-[300px] mb-6 rounded-xl overflow-hidden" />
            <RideComparisonList />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
