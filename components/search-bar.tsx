"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ArrowRight, Mic, Locate } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocation } from "@/components/location-provider"
import { useToast } from "@/components/ui/use-toast"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const [pickup, setPickup] = useState("Koramangala, Bangalore")
  const [destination, setDestination] = useState("Indiranagar, Bangalore")
  const [isListening, setIsListening] = useState(false)
  const [activeInput, setActiveInput] = useState<string | null>(null)
  const { requestLocation } = useLocation()
  const { toast } = useToast()

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
    setPickup("Current Location (Bangalore)")
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="flex-1"
              id="pickup"
            />
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => startListening("pickup")}
                className={cn(activeInput === "pickup" && isListening ? "bg-primary text-primary-foreground" : "")}
              >
                <Mic className="h-4 w-4" />
                <span className="sr-only">Voice input for pickup</span>
              </Button>
              <Button variant="outline" size="icon" type="button" onClick={detectCurrentLocation}>
                <Locate className="h-4 w-4" />
                <span className="sr-only">Use current location</span>
              </Button>
            </div>
          </div>

          <ArrowRight className="hidden md:block h-5 w-5 text-muted-foreground flex-shrink-0 self-center" />

          <div className="flex items-center gap-2 flex-1">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1"
              id="destination"
            />
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => startListening("destination")}
              className={cn(activeInput === "destination" && isListening ? "bg-primary text-primary-foreground" : "")}
            >
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input for destination</span>
            </Button>
          </div>

          <Button type="button" className="flex-shrink-0">
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
