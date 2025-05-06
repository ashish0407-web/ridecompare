"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, PlusCircle, MinusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation } from "@/components/location-provider"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { LocationSearch } from "@/components/location-search"
import { useAuth } from "@/components/auth-provider"

interface SearchFormProps {
  className?: string
}

interface LocationInput {
  id: string
  value: string
  placeId?: string
  coordinates?: { lat: number; lng: number }
}

export function SearchForm({ className }: SearchFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { currentLocation, isLoading: locationLoading, error: locationError, requestLocation } = useLocation()
  const { user } = useAuth()

  const [pickup, setPickup] = useState<LocationInput>({ id: "pickup", value: "" })
  const [destination, setDestination] = useState<LocationInput>({ id: "destination", value: "" })
  const [intermediateStops, setIntermediateStops] = useState<LocationInput[]>([])
  const [isListening, setIsListening] = useState(false)
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const [date, setDate] = useState<string>("")
  const [time, setTime] = useState<string>("")

  // Handle location detection
  useEffect(() => {
    if (locationError) {
      toast({
        title: "Location Error",
        description: locationError,
        variant: "destructive",
      })
    }
  }, [locationError, toast])

  // Handle speech recognition
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
      } else {
        // For intermediate stops
        setIntermediateStops((prev) =>
          prev.map((stop) => (stop.id === inputId ? { ...stop, value: transcript } : stop)),
        )
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

    if (currentLocation) {
      // In a real app, we would use reverse geocoding to get the address
      setPickup({
        ...pickup,
        value: "Current Location",
        coordinates: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        },
      })

      toast({
        title: "Location Detected",
        description: "Your current location has been set as the pickup point.",
      })
    }
  }

  const addIntermediateStop = () => {
    setIntermediateStops((prev) => [...prev, { id: `stop-${Date.now()}`, value: "" }])
  }

  const removeIntermediateStop = (id: string) => {
    setIntermediateStops((prev) => prev.filter((stop) => stop.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to compare ride fares.",
      })
      router.push("/auth/login")
      return
    }

    if (pickup.value && destination.value) {
      // In a real app, we would encode the route information in the URL or state
      const searchParams = new URLSearchParams()

      if (pickup.coordinates) {
        searchParams.set("pickupLat", pickup.coordinates.lat.toString())
        searchParams.set("pickupLng", pickup.coordinates.lng.toString())
      }
      searchParams.set("pickup", pickup.value)

      if (destination.coordinates) {
        searchParams.set("destLat", destination.coordinates.lat.toString())
        searchParams.set("destLng", destination.coordinates.lng.toString())
      }
      searchParams.set("destination", destination.value)

      // Add intermediate stops if any
      if (intermediateStops.length > 0) {
        intermediateStops.forEach((stop, index) => {
          searchParams.set(`stop${index}`, stop.value)
          if (stop.coordinates) {
            searchParams.set(`stop${index}Lat`, stop.coordinates.lat.toString())
            searchParams.set(`stop${index}Lng`, stop.coordinates.lng.toString())
          }
        })
      }

      // Add date and time if scheduled
      if (date) searchParams.set("date", date)
      if (time) searchParams.set("time", time)

      router.push(`/results?${searchParams.toString()}`)
    } else {
      toast({
        title: "Missing Information",
        description: "Please enter both pickup and destination locations.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className={cn("w-full shadow-lg", className)} id="search">
      <CardHeader>
        <CardTitle>Compare Ride Prices Across India</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="now">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="now">Ride Now</TabsTrigger>
            <TabsTrigger value="later">Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="now">
            <form onSubmit={handleSubmit} className="space-y-4">
              <LocationSearch
                id="pickup"
                value={pickup.value}
                onChange={(value, placeId, coordinates) => setPickup({ ...pickup, value, placeId, coordinates })}
                placeholder="Pickup location"
                onVoiceInput={() => startListening("pickup")}
                onLocationDetect={detectCurrentLocation}
                isListening={isListening && activeInput === "pickup"}
              />

              {intermediateStops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2">
                  <LocationSearch
                    id={stop.id}
                    value={stop.value}
                    onChange={(value, placeId, coordinates) =>
                      setIntermediateStops((prev) =>
                        prev.map((s) => (s.id === stop.id ? { ...s, value, placeId, coordinates } : s)),
                      )
                    }
                    placeholder="Intermediate stop"
                    onVoiceInput={() => startListening(stop.id)}
                    isListening={isListening && activeInput === stop.id}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => removeIntermediateStop(stop.id)}
                    className="flex-shrink-0"
                  >
                    <MinusCircle className="h-4 w-4" />
                    <span className="sr-only">Remove stop</span>
                  </Button>
                </div>
              ))}

              <LocationSearch
                id="destination"
                value={destination.value}
                onChange={(value, placeId, coordinates) =>
                  setDestination({ ...destination, value, placeId, coordinates })
                }
                placeholder="Destination"
                onVoiceInput={() => startListening("destination")}
                isListening={isListening && activeInput === "destination"}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={addIntermediateStop}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Stop</span>
              </Button>

              <Button type="submit" className="w-full">
                Compare Rides
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="later">
            <form onSubmit={handleSubmit} className="space-y-4">
              <LocationSearch
                id="pickup-scheduled"
                value={pickup.value}
                onChange={(value, placeId, coordinates) => setPickup({ ...pickup, value, placeId, coordinates })}
                placeholder="Pickup location"
                onVoiceInput={() => startListening("pickup")}
                onLocationDetect={detectCurrentLocation}
                isListening={isListening && activeInput === "pickup"}
              />

              <LocationSearch
                id="destination-scheduled"
                value={destination.value}
                onChange={(value, placeId, coordinates) =>
                  setDestination({ ...destination, value, placeId, coordinates })
                }
                placeholder="Destination"
                onVoiceInput={() => startListening("destination")}
                isListening={isListening && activeInput === "destination"}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Schedule Ride
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
