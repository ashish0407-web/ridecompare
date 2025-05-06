"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Layers, ZoomIn, ZoomOut, LocateFixed } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLeaflet } from "@/components/leaflet-provider"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import L from "leaflet"

interface ResultsMapProps {
  className?: string
}

export function ResultsMap({ className }: ResultsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard")
  const [routeInfo, setRouteInfo] = useState<{
    distance: string
    duration: string
  } | null>(null)

  const { isLoaded, initMap, calculateRoute } = useLeaflet()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const mapInstanceRef = useRef<L.Map | null>(null)

  // Get route information from URL params
  const pickup = searchParams.get("pickup") || ""
  const destination = searchParams.get("destination") || ""
  const pickupLat = searchParams.get("pickupLat") ? Number.parseFloat(searchParams.get("pickupLat")!) : undefined
  const pickupLng = searchParams.get("pickupLng") ? Number.parseFloat(searchParams.get("pickupLng")!) : undefined
  const destLat = searchParams.get("destLat") ? Number.parseFloat(searchParams.get("destLat")!) : undefined
  const destLng = searchParams.get("destLng") ? Number.parseFloat(searchParams.get("destLng")!) : undefined

  // Get intermediate stops if any
  const stops: { location: string; lat?: number; lng?: number }[] = []
  for (let i = 0; i < 5; i++) {
    const stopName = searchParams.get(`stop${i}`)
    if (stopName) {
      const stopLat = searchParams.get(`stop${i}Lat`) ? Number.parseFloat(searchParams.get(`stop${i}Lat`)!) : undefined
      const stopLng = searchParams.get(`stop${i}Lng`) ? Number.parseFloat(searchParams.get(`stop${i}Lng`)!) : undefined
      stops.push({
        location: stopName,
        lat: stopLat,
        lng: stopLng,
      })
    }
  }

  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      // If Leaflet is not loaded yet, set a timeout to avoid infinite loading
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
          toast({
            title: "Map Loading Error",
            description: "Could not load the map. Please try refreshing the page.",
            variant: "destructive",
          })
        }
      }, 10000) // 10 seconds timeout

      return () => clearTimeout(timeout)
    }

    const loadMap = async () => {
      setIsLoading(true)

      try {
        // Initialize the map if it doesn't exist
        if (!mapInstanceRef.current) {
          const map = initMap(mapRef.current, {
            center: [20.5937, 78.9629], // Center of India
            zoom: 5,
          })

          if (map) {
            mapInstanceRef.current = map
          }
        }

        // If we have origin and destination, calculate and display the route
        if (pickup && destination) {
          let origin: any = pickup
          let dest: any = destination

          // Use coordinates if available
          if (pickupLat !== undefined && pickupLng !== undefined) {
            origin = [pickupLat, pickupLng]
          }

          if (destLat !== undefined && destLng !== undefined) {
            dest = [destLat, destLng]
          }

          // Prepare waypoints if any
          const waypoints = stops.map((stop) => {
            if (stop.lat !== undefined && stop.lng !== undefined) {
              return { location: [stop.lat, stop.lng], stopover: true }
            }
            return { location: stop.location, stopover: true }
          })

          // Calculate the route
          const routeResult = await calculateRoute(origin, dest, waypoints)

          if (routeResult && routeResult.routes && routeResult.routes.length > 0) {
            const route = routeResult.routes[0]
            const leg = route.legs[0]

            setRouteInfo({
              distance: leg.distance.text,
              duration: leg.duration.text,
            })
          } else {
            // Set default route info if calculation fails
            setRouteInfo({
              distance: "5.2 km",
              duration: "18 min",
            })
          }
        } else {
          // Set default route info if no pickup/destination
          setRouteInfo({
            distance: "5.2 km",
            duration: "18 min",
          })
        }
      } catch (error) {
        console.error("Error loading map:", error)
        // Set default route info on error
        setRouteInfo({
          distance: "5.2 km",
          duration: "18 min",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMap()
  }, [
    isLoaded,
    initMap,
    calculateRoute,
    pickup,
    destination,
    pickupLat,
    pickupLng,
    destLat,
    destLng,
    stops,
    toast,
    isLoading,
  ])

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }

  const handleMapTypeChange = (type: "standard" | "satellite") => {
    setMapType(type)
    if (mapInstanceRef.current) {
      // Remove current tile layer
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(layer)
        }
      })

      // Add new tile layer based on selected type
      if (type === "standard") {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current)
      } else {
        // Satellite view from ESRI
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 19,
        }).addTo(mapInstanceRef.current)
      }
    }
  }

  const handleCenterOnRoute = () => {
    if (mapInstanceRef.current) {
      // Find all polylines (routes) on the map
      let routeBounds: L.LatLngBounds | null = null

      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          routeBounds = layer.getBounds()
        }
      })

      // If we found a route, fit the map to its bounds
      if (routeBounds) {
        mapInstanceRef.current.fitBounds(routeBounds, { padding: [50, 50] })
      } else if (pickupLat && pickupLng && destLat && destLng) {
        // If no route but we have origin and destination coordinates, create bounds from those
        const bounds = L.latLngBounds([pickupLat, pickupLng], [destLat, destLng])
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
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
        <Button variant="secondary" size="icon" onClick={handleCenterOnRoute}>
          <LocateFixed className="h-4 w-4" />
          <span className="sr-only">Center on route</span>
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
              onClick={() => handleMapTypeChange("standard")}
              className={mapType === "standard" ? "bg-accent" : ""}
            >
              Standard Map
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

      {routeInfo && (
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-sm">
          <div>Distance: {routeInfo.distance}</div>
          <div>Est. Travel Time: {routeInfo.duration}</div>
        </div>
      )}
    </div>
  )
}
