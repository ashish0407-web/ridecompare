"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Leaf, ExternalLink, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SurgeGraph } from "@/components/surge-graph"
import { useSearchParams } from "next/navigation"

// Base fare rates for different ride types (per km)
const baseFareRates = {
  UberGo: 12, // ₹12 per km
  "Ola Mini": 13, // ₹13 per km
  "Rapido Bike": 8, // ₹8 per km
  UberAuto: 9, // ₹9 per km
  "Ola Auto": 9.5, // ₹9.5 per km
  "Uber Premier": 16, // ₹16 per km
  "Ola Prime": 17, // ₹17 per km
  "Uber XL": 20, // ₹20 per km
  "Ola SUV": 21, // ₹21 per km
}

// Base fare (minimum fare)
const baseFare = {
  UberGo: 50,
  "Ola Mini": 55,
  "Rapido Bike": 30,
  UberAuto: 35,
  "Ola Auto": 40,
  "Uber Premier": 80,
  "Ola Prime": 85,
  "Uber XL": 100,
  "Ola SUV": 110,
}

// Function to calculate fare based on distance
const calculateFare = (rideType: string, distance: number, applyDiscount = false, applySurge = "none") => {
  // Get the base fare rate for this ride type
  const ratePerKm = baseFareRates[rideType as keyof typeof baseFareRates] || 10
  const minimumFare = baseFare[rideType as keyof typeof baseFare] || 40

  // Calculate the fare based on distance
  let fare = Math.max(minimumFare, Math.round(distance * ratePerKm))

  // Add booking fee
  fare += 25

  // Apply surge pricing if applicable
  if (applySurge === "high") {
    fare = Math.round(fare * 1.8) // 80% surge
  } else if (applySurge === "medium") {
    fare = Math.round(fare * 1.4) // 40% surge
  } else if (applySurge === "low") {
    fare = Math.round(fare * 1.2) // 20% surge
  }

  // Apply discount if applicable
  const originalFare = fare
  if (applyDiscount) {
    fare = Math.round(fare * 0.85) // 15% discount
  }

  return {
    price: fare,
    originalPrice: applyDiscount ? originalFare : null,
  }
}

// Function to generate random variation in fare
const applyFareVariation = (baseFare: number) => {
  const variation = baseFare * (Math.random() * 0.05) // 0-5% variation
  const increase = Math.random() > 0.5 // 50% chance of increase or decrease
  return Math.round(baseFare + (increase ? variation : -variation))
}

// Generate ride options with dynamic pricing based on distance
const generateRideOptions = (distance = 5.2) => {
  // Apply small random variations to distance for each provider
  const uberDistance = distance * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5%
  const olaDistance = distance * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5%
  const rapidoDistance = distance * (1 + (Math.random() * 0.1 - 0.05)) // +/- 5%

  return [
    {
      id: 1,
      provider: "Uber",
      logo: "/placeholder.svg?height=40&width=40",
      type: "UberGo",
      ...calculateFare("UberGo", uberDistance, true, Math.random() > 0.7 ? "low" : "none"),
      eta: Math.floor(Math.random() * 5) + 2 + " min", // 2-7 min
      duration: Math.floor((15 * distance) / 5) + " min",
      distance: uberDistance.toFixed(1) + " km",
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      ecoScore: Math.round(7 + Math.random() * 1.5),
      discount: true,
      surgeStatus: Math.random() > 0.7 ? "low" : "none",
      driverName: "Rajesh K.",
      carDetails: "Swift Dzire - KA01AB1234",
    },
    {
      id: 2,
      provider: "Ola",
      logo: "/placeholder.svg?height=40&width=40",
      type: "Ola Mini",
      ...calculateFare("Ola Mini", olaDistance, false, Math.random() > 0.6 ? "medium" : "none"),
      eta: Math.floor(Math.random() * 5) + 3 + " min", // 3-8 min
      duration: Math.floor((16 * distance) / 5) + " min",
      distance: olaDistance.toFixed(1) + " km",
      rating: (4.4 + Math.random() * 0.5).toFixed(1),
      ecoScore: Math.round(7 + Math.random() * 1.5),
      discount: false,
      surgeStatus: Math.random() > 0.6 ? "medium" : "none",
      driverName: "Suresh M.",
      carDetails: "Wagon R - KA02CD5678",
    },
    {
      id: 3,
      provider: "Rapido",
      logo: "/placeholder.svg?height=40&width=40",
      type: "Bike",
      ...calculateFare("Rapido Bike", rapidoDistance, false, "none"),
      eta: Math.floor(Math.random() * 3) + 1 + " min", // 1-4 min
      duration: Math.floor((12 * distance) / 5) + " min",
      distance: rapidoDistance.toFixed(1) + " km",
      rating: (4.3 + Math.random() * 0.5).toFixed(1),
      ecoScore: Math.round(8.5 + Math.random() * 1),
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
      ...calculateFare("UberAuto", uberDistance, true, "none"),
      eta: Math.floor(Math.random() * 4) + 2 + " min", // 2-6 min
      duration: Math.floor((20 * distance) / 5) + " min",
      distance: uberDistance.toFixed(1) + " km",
      rating: (4.6 + Math.random() * 0.3).toFixed(1),
      ecoScore: Math.round(8 + Math.random() * 1),
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
      ...calculateFare("Ola Auto", olaDistance, false, Math.random() > 0.7 ? "high" : "medium"),
      eta: Math.floor(Math.random() * 5) + 3 + " min", // 3-8 min
      duration: Math.floor((22 * distance) / 5) + " min",
      distance: olaDistance.toFixed(1) + " km",
      rating: (4.4 + Math.random() * 0.4).toFixed(1),
      ecoScore: Math.round(8 + Math.random() * 1),
      discount: false,
      surgeStatus: Math.random() > 0.7 ? "high" : "medium",
      driverName: "Kumar P.",
      autoDetails: "Auto - KA05IJ7890",
    },
    {
      id: 6,
      provider: "Uber",
      logo: "/placeholder.svg?height=40&width=40",
      type: "Premier",
      ...calculateFare("Uber Premier", uberDistance, false, Math.random() > 0.8 ? "low" : "none"),
      eta: Math.floor(Math.random() * 4) + 3 + " min", // 3-7 min
      duration: Math.floor((14 * distance) / 5) + " min",
      distance: uberDistance.toFixed(1) + " km",
      rating: (4.7 + Math.random() * 0.3).toFixed(1),
      ecoScore: Math.round(6 + Math.random() * 1),
      discount: false,
      surgeStatus: Math.random() > 0.8 ? "low" : "none",
      driverName: "Anil G.",
      carDetails: "Honda City - KA06KL2345",
    },
  ]
}

export function RideComparisonList() {
  const [sortBy, setSortBy] = useState("price")
  const [showSurgeGraph, setShowSurgeGraph] = useState(false)
  const [rideOptions, setRideOptions] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // Get distance from route info if available
  const routeDistance = searchParams.get("distance")
    ? Number.parseFloat(searchParams.get("distance")!)
    : searchParams.get("routeDistance")
      ? Number.parseFloat(searchParams.get("routeDistance")!)
      : 5.2 // Default distance in km

  // Initialize ride options
  useEffect(() => {
    setRideOptions(generateRideOptions(routeDistance))
  }, [routeDistance])

  // Refresh fare rates
  const refreshFares = () => {
    setIsRefreshing(true)

    // Simulate API call delay
    setTimeout(() => {
      setRideOptions(generateRideOptions(routeDistance))
      setIsRefreshing(false)

      toast({
        title: "Fares Updated",
        description: "Ride fare rates have been refreshed with the latest prices.",
      })
    }, 1000)
  }

  // Sort options based on selected criteria
  const sortedOptions = [...rideOptions].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price
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
            onClick={refreshFares}
            className="flex items-center gap-1"
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Fares"}</span>
          </Button>
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
                          <span className="text-sm text-muted-foreground line-through mr-2">₹{ride.originalPrice}</span>
                        )}
                        <span className="text-lg font-bold">₹{ride.price}</span>
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
