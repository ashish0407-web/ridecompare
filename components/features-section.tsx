import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, IndianRupee, MapPin, BarChart3, Zap, WifiOff } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose RideCompare India?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers unique features to help you find the best ride at the best price across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <IndianRupee className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Real-time Fare Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compare prices across Uber, Ola, Rapido and more in real-time to find the best deal for your journey in
                Indian Rupees.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Clock className="h-6 w-6 text-primary mb-2" />
              <CardTitle>ETA & Wait Times</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                See accurate estimated arrival times and wait times for each ride option to plan your journey better.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Zap className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Surge Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI-powered surge prediction helps you avoid high prices by forecasting fare increases in your area.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <MapPin className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Multi-route Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plan complex journeys with multiple stops and get accurate fare estimates for your entire trip across
                Indian cities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <BarChart3 className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Demand Heatmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visualize high-demand areas in Indian cities and plan your journey to avoid congestion and higher
                prices.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <WifiOff className="h-6 w-6 text-primary mb-2" />
              <CardTitle>Offline Estimation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get fare estimates even when you're offline, perfect for areas with limited connectivity across India.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
