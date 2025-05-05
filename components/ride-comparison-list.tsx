"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Leaf, ExternalLink, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SurgeGraph } from "@/components/surge-graph"

// Mock data for ride options
const rideOptions = [
  {
    id: 1,
    provider: "Uber",
    logo: "/placeholder.svg?height=40&width=40",
    type: "UberGo",
    price: "₹249",
    originalPrice: "₹299",
    eta: "3 min",
    duration: "18 min",
    distance: "5.2 km",
    rating: 4.8,
    ecoScore: 7.5,
    discount: true,
    surgeStatus: "low",
    driverName: "Rajesh K.",
    carDetails: "Swift Dzire - KA01AB1234",
  },
  {
    id: 2,
    provider: "Ola",
    logo: "/placeholder.svg?height=40&width=40",
    type: "Ola Mini",
    price: "₹275",
    originalPrice: null,
    eta: "5 min",
    duration: "19 min",
    distance: "5.2 km",
    rating: 4.6,
    ecoScore: 7.2,
    discount: false,
    surgeStatus: "medium",
    driverName: "Suresh M.",
    carDetails: "Wagon R - KA02CD5678",
  },
  {
    id: 3,
    provider: "Rapido",
    logo: "/placeholder.svg?height=40&width=40",
    type: "Bike",
    price: "₹165",
    originalPrice: null,
    eta: "2 min",
    duration: "12 min",
    distance: "5.2 km",
    rating: 4.5,
    ecoScore: 9.0,
    discount: false,
    surgeStatus: "none",
    driverName: "Amit S.",
    bikeDetails: "Pulsar - KA03EF9012",
  },
  {
    id: 4,
    provider: "Uber",
    logo: "/placeholder.svg?height=40&width=40",
    type: "UberAuto",
    price: "₹190",
    originalPrice: "₹220",
    eta: "4 min",
    duration: "20 min",
    distance: "5.2 km",
    rating: 4.7,
    ecoScore: 8.5,
    discount: true,
    surgeStatus: "none",
    driverName: "Venkat R.",
    autoDetails: "Auto - KA04GH3456",
  },
  {
    id: 5,
    provider: "Ola",
    logo: "/placeholder.svg?height=40&width=40",
    type: "Ola Auto",
    price: "₹195",
    originalPrice: null,
    eta: "6 min",
    duration: "22 min",
    distance: "5.2 km",
    rating: 4.5,
    ecoScore: 8.7,
    discount: false,
    surgeStatus: "high",
    driverName: "Kumar P.",
    autoDetails: "Auto - KA05IJ7890",
  },
]

export function RideComparisonList() {
  const [sortBy, setSortBy] = useState("price")
  const [showSurgeGraph, setShowSurgeGraph] = useState(false)
  const { toast } = useToast()

  // Sort options based on selected criteria
  const sortedOptions = [...rideOptions].sort((a, b) => {
    if (sortBy === "price") {
      return Number.parseFloat(a.price.replace("₹", "")) - Number.parseFloat(b.price.replace("₹", ""))
    } else if (sortBy === "time") {
      return Number.parseInt(a.eta) - Number.parseInt(b.eta)
    } else if (sortBy === "eco") {
      return b.ecoScore - a.ecoScore
    }
    return 0
  })

  const handleBookRide = (provider: string) => {
    // In a real app, this would redirect to the provider's app
    toast({
      title: `Redirecting to ${provider}`,
      description: "You'll be redirected to complete your booking.",
    })
  }

  const getSurgeIcon = (surgeStatus: string) => {
    switch (surgeStatus) {
      case "high":
        return <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
      case "medium":
        return <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
      case "low":
        return <TrendingUp className="h-3 w-3 text-yellow-500 mr-1" />
      default:
        return <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
    }
  }

  const getSurgeText = (surgeStatus: string) => {
    switch (surgeStatus) {
      case "high":
        return "High surge pricing"
      case "medium":
        return "Moderate surge pricing"
      case "low":
        return "Slight surge pricing"
      default:
        return "No surge pricing"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Rides</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSurgeGraph(!showSurgeGraph)}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Surge Forecast</span>
          </Button>
          <Tabs defaultValue="price" onValueChange={(value) => setSortBy(value)}>
            <TabsList>
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="time">Time</TabsTrigger>
              <TabsTrigger value="eco">Eco</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {showSurgeGraph && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Surge Price Forecast</h3>
          <SurgeGraph />
          <p className="text-sm text-muted-foreground mt-2">
            Prices are expected to drop in about 30 minutes. Consider waiting for better rates.
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {sortedOptions.map((ride) => (
          <Card key={ride.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className="flex-shrink-0 mr-4">
                  <Image
                    src={ride.logo || "/placeholder.svg"}
                    alt={ride.provider}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {ride.provider} - {ride.type}
                        </h3>
                        {ride.discount && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>ETA: {ride.eta}</span>
                        <span className="mx-2">•</span>
                        <span>{ride.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{ride.distance}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {ride.driverName} • {ride.carDetails || ride.autoDetails || ride.bikeDetails}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end">
                        {ride.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through mr-2">{ride.originalPrice}</span>
                        )}
                        <span className="text-lg font-bold">{ride.price}</span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{ride.rating}</span>
                        <span className="mx-2">•</span>
                        <Leaf className="h-3 w-3 text-green-500 mr-1" />
                        <span>Eco: {ride.ecoScore}/10</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-xs mt-1 justify-end">
                              {getSurgeIcon(ride.surgeStatus)}
                              <span>{getSurgeText(ride.surgeStatus)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Based on current demand in your area</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t p-3 bg-muted/30 flex justify-end">
                <Button size="sm" className="gap-2" onClick={() => handleBookRide(ride.provider)}>
                  Book with {ride.provider}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
