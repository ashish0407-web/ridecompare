"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation } from "@/components/location-provider"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { LocationSearch } from "@/components/location-search"
import { useLeaflet } from "@/components/leaflet-provider"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { requestLocation } = useLocation()
  const { toast } = useToast()
  const { calculateRoute } = useLeaflet()

  // Get initial values from URL params
  const initialPickup = searchParams.get("pickup") || "Koramangala, Bangalore"
  const initialDestination = searchParams.get("destination") || "Indiranagar, Bangalore"

  const [pickup, setPickup] = useState({
    value: initialPickup,
    placeId: searchParams.get("pickupPlaceId") || undefined,
    coordinates:
      searchParams.has("pickupLat") && searchParams.has("pickupLng")
        ? {
            lat: Number.parseFloat(searchParams.get("pickupLat")!),
            lng: Number.parseFloat(searchParams.get("pickupLng")!),
          }
        : undefined,
  })

  const [destination, setDestination] = useState({
    value: initialDestination,
    placeId: searchParams.get("destPlaceId") || undefined,
    coordinates:
      searchParams.has("destLat") && searchParams.has("destLng")
        ? {
            lat: Number.parseFloat(searchParams.get("destLat")!),
            lng: Number.parseFloat(searchParams.get("destLng")!),
          }
        : undefined,
  })

  const [isListening, setIsListening] = useState(false)
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const startListening = (inputId: string) => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    setIsListening(true)
    setActiveInput(inputId)

    const SpeechRecognition = window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript

      if (inputId === "pickup") {
        setPickup({ ...pickup, value: transcript })
      } else if (inputId === "destination") {
        setDestination({ ...destination, value: transcript })
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setActiveInput(null)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setActiveInput(null)
      toast({
        title: "Speech Recognition Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      })
    }

    recognition.start()
  }

  const detectCurrentLocation = async () => {
    await requestLocation()

    toast({
      title: "Location Updated",
      description: "Your current location has been set as the pickup point.",
    })

    // In a real app, we would use reverse geocoding to get the address
    setPickup({
      ...pickup,
      value: "Current Location (Bangalore)",
    })
  }

  const handleUpdate = async () => {
    setIsUpdating(true)

    try {
      const params = new URLSearchParams()

      params.set("pickup", pickup.value)
      if (pickup.coordinates) {
        params.set("pickupLat", pickup.coordinates.lat.toString())
        params.set("pickupLng", pickup.coordinates.lng.toString())
      }
      if (pickup.placeId) {
        params.set("pickupPlaceId", pickup.placeId)
      }

      params.set("destination", destination.value)
      if (destination.coordinates) {
        params.set("destLat", destination.coordinates.lat.toString())
        params.set("destLng", destination.coordinates.lng.toString())
      }
      if (destination.placeId) {
        params.set("destPlaceId", destination.placeId)
      }

      // Preserve any other params like stops
      for (let i = 0; i < 5; i++) {
        const stopName = searchParams.get(`stop${i}`)
        if (stopName) {
          params.set(`stop${i}`, stopName)
          const stopLat = searchParams.get(`stop${i}Lat`)
          const stopLng = searchParams.get(`stop${i}Lng`)
          if (stopLat) params.set(`stop${i}Lat`, stopLat)
          if (stopLng) params.set(`stop${i}Lng`, stopLng)
        }
      }

      // Calculate route to get accurate distance
      let origin: any = pickup.value
      let dest: any = destination.value

      // Use coordinates if available
      if (pickup.coordinates) {
        origin = [pickup.coordinates.lat, pickup.coordinates.lng]
      }

      if (destination.coordinates) {
        dest = [destination.coordinates.lat, destination.coordinates.lng]
      }

      // Calculate the route to get distance
      const routeResult = await calculateRoute(origin, dest)

      if (routeResult && routeResult.routes && routeResult.routes.length > 0) {
        const route = routeResult.routes[0]
        const leg = route.legs[0]

        // Add route distance to params
        const distanceInKm = leg.distance.value / 1000
        params.set("routeDistance", distanceInKm.toFixed(1))
      }

      // Navigate to the results page with updated parameters
      router.push(`/results?${params.toString()}`)

      // Refresh fare rates
      toast({
        title: "Fares Updated",
        description: "Ride fare rates have been refreshed based on your route.",
      })
    } catch (error) {
      console.error("Error updating route:", error)
      toast({
        title: "Update Error",
        description: "There was an error updating the route. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-3">
        <div className="flex flex-col md:flex-row gap-3">
          <LocationSearch
            value={pickup.value}
            onChange={(value, placeId, coordinates) => setPickup({ value, placeId, coordinates })}
            placeholder="Pickup location"
            onVoiceInput={() => startListening("pickup")}
            onLocationDetect={detectCurrentLocation}
            isListening={isListening && activeInput === "pickup"}
            className="flex-1"
            id="search-pickup"
          />

          <ArrowRight className="hidden md:block h-5 w-5 text-muted-foreground flex-shrink-0 self-center" />

          <LocationSearch
            value={destination.value}
            onChange={(value, placeId, coordinates) => setDestination({ value, placeId, coordinates })}
            placeholder="Destination"
            onVoiceInput={() => startListening("destination")}
            isListening={isListening && activeInput === "destination"}
            className="flex-1"
            id="search-destination"
          />

          <Button type="button" className="flex-shrink-0" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
