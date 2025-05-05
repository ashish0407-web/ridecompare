"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Layers, ZoomIn, ZoomOut } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ResultsMapProps {
  className?: string
}

// Mock coordinates for demo
const PICKUP_COORDS = { lat: 12.9716, lng: 77.5946 } // Bangalore
const DESTINATION_COORDS = { lat: 12.9352, lng: 77.6245 } // Koramangala

export function ResultsMap({ className }: ResultsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")

  useEffect(() => {
    // This would be where we initialize Google Maps
    // For this demo, we'll simulate loading the map

    const loadMap = async () => {
      setIsLoading(true)

      // Simulate map loading delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (mapRef.current) {
        // In a real implementation, we would initialize Google Maps here
        // For now, we'll just use a placeholder image and add some styling

        const mapElement = mapRef.current
        mapElement.style.backgroundImage = "url('/placeholder.svg?height=500&width=800')"
        mapElement.style.backgroundSize = "cover"
        mapElement.style.backgroundPosition = "center"

        // Add pickup and destination markers
        const pickupMarker = document.createElement("div")
        pickupMarker.className =
          "absolute w-6 h-6 bg-green-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
        pickupMarker.style.left = "30%"
        pickupMarker.style.top = "40%"
        pickupMarker.title = "Pickup Location"

        const destMarker = document.createElement("div")
        destMarker.className =
          "absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
        destMarker.style.left = "70%"
        destMarker.style.top = "60%"
        destMarker.title = "Destination"

        // Add route line
        const routeLine = document.createElement("div")
        routeLine.className = "absolute h-1 bg-blue-500 transform rotate-45"
        routeLine.style.width = "45%"
        routeLine.style.left = "30%"
        routeLine.style.top = "45%"

        mapElement.appendChild(routeLine)
        mapElement.appendChild(pickupMarker)
        mapElement.appendChild(destMarker)

        setIsLoading(false)
      }
    }

    loadMap()

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.innerHTML = ""
      }
    }
  }, [mapType])

  const handleZoomIn = () => {
    // In a real implementation, we would zoom the map in
    console.log("Zoom in")
  }

  const handleZoomOut = () => {
    // In a real implementation, we would zoom the map out
    console.log("Zoom out")
  }

  const handleMapTypeChange = (type: "roadmap" | "satellite") => {
    setMapType(type)
  }

  return (
    <div className={cn("relative w-full h-full bg-muted rounded-xl overflow-hidden", className)}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2 w-full max-w-md px-4">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-72 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ) : null}

      <div
        ref={mapRef}
        className={cn("w-full h-full transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
      />

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
          <span className="sr-only">Zoom out</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <Layers className="h-4 w-4" />
              <span className="sr-only">Map layers</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleMapTypeChange("roadmap")}
              className={mapType === "roadmap" ? "bg-accent" : ""}
            >
              Road Map
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMapTypeChange("satellite")}
              className={mapType === "satellite" ? "bg-accent" : ""}
            >
              Satellite
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-sm">
        <div>Distance: 5.2 km</div>
        <div>Est. Travel Time: 18 min</div>
      </div>
    </div>
  )
}
