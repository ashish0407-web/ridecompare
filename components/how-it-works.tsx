import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Map, Car } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Finding the best ride is simple with RideCompare India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter Your Route</h3>
            <p className="text-muted-foreground">
              Enter your pickup location and destination to start comparing ride options across India.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Map className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compare Options</h3>
            <p className="text-muted-foreground">
              View a list of available ride options with real-time prices in Indian Rupees, ETAs, and ratings.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Your Ride</h3>
            <p className="text-muted-foreground">
              Select your preferred option and get redirected to the provider's app to complete your booking.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="#search">Try It Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
