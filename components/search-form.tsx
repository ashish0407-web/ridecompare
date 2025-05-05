"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Mic, PlusCircle, MinusCircle, Locate } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation } from "@/components/location-provider"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchFormProps {
  className?: string
}

interface LocationInput {
  id: string
  value: string
}

export function SearchForm({ className }: SearchFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { currentLocation, isLoading: locationLoading, error: locationError, requestLocation } = useLocation()

  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [isMultiRoute, setIsMultiRoute] = useState(false)
  const [intermediateStops, setIntermediateStops] = useState<LocationInput[]>([])
  const [isListening, setIsListening] = useState(false)
  const [activeInput, setActiveInput] = useState<string | null>(null)

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
        setPickup(transcript)
      } else if (inputId === "destination") {
        setDestination(transcript)
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
      // For now, we'll just use the coordinates
      const locationString = `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
      setPickup(locationString)

      toast({
        title: "Location Detected",
        description: "Your current location has been set as the pickup point.",
      })
    }
  }

  const addIntermediateStop = () => {
    setIntermediateStops((prev) => [...prev, { id: `stop-${Date.now()}`, value: "" }])
    setIsMultiRoute(true)
  }

  const removeIntermediateStop = (id: string) => {
    setIntermediateStops((prev) => prev.filter((stop) => stop.id !== id))
    if (intermediateStops.length <= 1) {
      setIsMultiRoute(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pickup && destination) {
      // In a real app, we would encode the route information in the URL or state
      router.push("/results")
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
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    required
                    id="pickup"
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => startListening("pickup")}
                      className={cn(
                        activeInput === "pickup" && isListening ? "bg-primary text-primary-foreground" : "",
                      )}
                    >
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">Voice input for pickup</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={detectCurrentLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <Locate className="h-4 w-4" />}
                      <span className="sr-only">Use current location</span>
                    </Button>
                  </div>
                </div>
              </div>

              {isMultiRoute &&
                intermediateStops.map((stop) => (
                  <div key={stop.id} className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Intermediate stop"
                        value={stop.value}
                        onChange={(e) =>
                          setIntermediateStops((prev) =>
                            prev.map((s) => (s.id === stop.id ? { ...s, value: e.target.value } : s)),
                          )
                        }
                        id={stop.id}
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => startListening(stop.id)}
                          className={cn(
                            activeInput === stop.id && isListening ? "bg-primary text-primary-foreground" : "",
                          )}
                        >
                          <Mic className="h-4 w-4" />
                          <span className="sr-only">Voice input for stop</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => removeIntermediateStop(stop.id)}
                        >
                          <MinusCircle className="h-4 w-4" />
                          <span className="sr-only">Remove stop</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    id="destination"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => startListening("destination")}
                    className={cn(
                      activeInput === "destination" && isListening ? "bg-primary text-primary-foreground" : "",
                    )}
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Voice input for destination</span>
                  </Button>
                </div>
              </div>

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
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    required
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => startListening("pickup")}
                      className={cn(
                        activeInput === "pickup" && isListening ? "bg-primary text-primary-foreground" : "",
                      )}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={detectCurrentLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <Locate className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => startListening("destination")}
                    className={cn(
                      activeInput === "destination" && isListening ? "bg-primary text-primary-foreground" : "",
                    )}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <Input type="date" min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <Input type="time" />
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
