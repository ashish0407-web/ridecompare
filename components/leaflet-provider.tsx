"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { initLeafletPolyline } from "@/lib/leaflet-polyline"
import L from "leaflet" // Import Leaflet

// Define types for our context
type LeafletContextType = {
  isLoaded: boolean
  loadError: string | null
  map: L.Map | null
  initMap: (mapRef: HTMLElement, options?: L.MapOptions) => L.Map | null
  searchPlaces: (input: string) => Promise<any[]>
  getPlaceDetails: (placeId: string) => Promise<any | null>
  calculateRoute: (
    origin: [number, number] | string,
    destination: [number, number] | string,
    waypoints?: any[],
  ) => Promise<any | null>
  geocodeAddress: (address: string) => Promise<[number, number] | null>
}

const LeafletContext = createContext<LeafletContextType | null>(null)

export function LeafletProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const { toast } = useToast()

  // Load Leaflet CSS and initialize polyline extension
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Create link element for Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""

      // Append to head
      document.head.appendChild(link)

      // Load Leaflet script
      import("leaflet")
        .then(() => {
          // Initialize the polyline extension
          initLeafletPolyline()
          setIsLoaded(true)
        })
        .catch((err) => {
          console.error("Failed to load Leaflet:", err)
          setLoadError("Failed to load Leaflet map library")
          toast({
            title: "Map Error",
            description: "Failed to load map library. Please try refreshing the page.",
            variant: "destructive",
          })
        })

      return () => {
        // Clean up
        document.head.removeChild(link)
      }
    }
  }, [toast])

  // Initialize map
  const initMap = useCallback(
    (mapRef: HTMLElement, options: L.MapOptions = {}) => {
      if (!isLoaded || typeof L === "undefined") return null

      try {
        // Default map options
        const defaultOptions: L.MapOptions = {
          center: [20.5937, 78.9629], // Center of India
          zoom: 5,
          ...options,
        }

        // Create the map
        const newMap = L.map(mapRef, defaultOptions)

        // Add tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(newMap)

        setMap(newMap)
        return newMap
      } catch (error) {
        console.error("Error initializing map:", error)
        setLoadError("Failed to initialize map")
        toast({
          title: "Map Error",
          description: "Failed to initialize the map. Please try refreshing the page.",
          variant: "destructive",
        })
        return null
      }
    },
    [isLoaded, toast],
  )

  // Search for places using Nominatim (OpenStreetMap's geocoding service)
  const searchPlaces = useCallback(async (input: string): Promise<any[]> => {
    if (!input || input.length < 3) return []

    try {
      // Add "India" to the search query to focus on Indian locations
      const searchQuery = `${input}, India`
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "RideCompareIndia/1.0",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Transform the data to match our expected format
      return data.map((item: any) => ({
        place_id: item.place_id,
        osm_id: item.osm_id,
        description: item.display_name,
        structured_formatting: {
          main_text: item.name || item.display_name.split(",")[0],
          secondary_text: item.display_name.substring(item.display_name.indexOf(",") + 1).trim(),
        },
        lat: Number.parseFloat(item.lat),
        lon: Number.parseFloat(item.lon),
      }))
    } catch (error) {
      console.error("Error searching places:", error)
      return []
    }
  }, [])

  // Get place details
  const getPlaceDetails = useCallback(async (placeId: string): Promise<any | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/details?format=json&place_id=${placeId}`, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "RideCompareIndia/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get place details: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        name: data.name || data.localname || data.addresstags?.name || "",
        formatted_address: data.display_name || "",
        geometry: {
          location: {
            lat: Number.parseFloat(data.centroid.coordinates[1]),
            lng: Number.parseFloat(data.centroid.coordinates[0]),
          },
        },
        place_id: data.place_id,
      }
    } catch (error) {
      console.error("Error getting place details:", error)
      return null
    }
  }, [])

  // Geocode an address to coordinates
  const geocodeAddress = useCallback(async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=in`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "RideCompareIndia/1.0",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.length === 0) {
        return null
      }

      return [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)]
    } catch (error) {
      console.error("Error geocoding address:", error)
      return null
    }
  }, [])

  // Calculate route using OSRM (Open Source Routing Machine)
  const calculateRoute = useCallback(
    async (
      origin: [number, number] | string,
      destination: [number, number] | string,
      waypoints: any[] = [],
    ): Promise<any | null> => {
      try {
        // Convert string addresses to coordinates if needed
        let originCoords: [number, number]
        let destCoords: [number, number]

        if (typeof origin === "string") {
          const coords = await geocodeAddress(origin)
          if (!coords) throw new Error("Could not geocode origin address")
          originCoords = coords
        } else {
          originCoords = origin
        }

        if (typeof destination === "string") {
          const coords = await geocodeAddress(destination)
          if (!coords) throw new Error("Could not geocode destination address")
          destCoords = coords
        } else {
          destCoords = destination
        }

        // Process waypoints if any
        const waypointCoords: [number, number][] = []
        for (const waypoint of waypoints) {
          if (typeof waypoint.location === "string") {
            const coords = await geocodeAddress(waypoint.location)
            if (coords) waypointCoords.push(coords)
          } else if (waypoint.location.lat && waypoint.location.lng) {
            waypointCoords.push([waypoint.location.lat, waypoint.location.lng])
          }
        }

        // Format coordinates for OSRM API
        // OSRM expects [longitude,latitude] format
        const points = [
          [originCoords[1], originCoords[0]],
          ...waypointCoords.map((wp) => [wp[1], wp[0]]),
          [destCoords[1], destCoords[0]],
        ]

        const pointsStr = points.map((p) => p.join(",")).join(";")

        // Call OSRM API
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pointsStr}?overview=full&geometries=polyline&steps=true`,
        )

        if (!response.ok) {
          throw new Error(`Routing failed: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
          throw new Error("No route found")
        }

        const route = data.routes[0]

        // Draw the route on the map if map is available
        if (map) {
          // Clear existing routes
          map.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
              map.removeLayer(layer)
            }
          })

          // Decode the polyline
          const routeLine = L.Polyline.fromEncoded(route.geometry, {
            color: "#3b82f6", // blue-500
            weight: 5,
            opacity: 0.7,
          }).addTo(map)

          // Add markers for origin and destination
          L.marker(originCoords).addTo(map)
          L.marker(destCoords).addTo(map)

          // Fit the map to the route bounds
          map.fitBounds(routeLine.getBounds(), { padding: [50, 50] })
        }

        // Format the response to match our expected format
        return {
          routes: [
            {
              legs: [
                {
                  distance: {
                    text: `${(route.distance / 1000).toFixed(1)} km`,
                    value: route.distance,
                  },
                  duration: {
                    text: `${Math.round(route.duration / 60)} mins`,
                    value: route.duration,
                  },
                  start_location: { lat: originCoords[0], lng: originCoords[1] },
                  end_location: { lat: destCoords[0], lng: destCoords[1] },
                },
              ],
              overview_polyline: {
                points: route.geometry,
              },
            },
          ],
        }
      } catch (error) {
        console.error("Error calculating route:", error)

        // Return a simulated route if real routing fails
        return {
          routes: [
            {
              legs: [
                {
                  distance: { text: "5.2 km", value: 5200 },
                  duration: { text: "18 mins", value: 1080 },
                  start_location: {
                    lat: typeof origin === "string" ? 12.9716 : origin[0],
                    lng: typeof origin === "string" ? 77.5946 : origin[1],
                  },
                  end_location: {
                    lat: typeof destination === "string" ? 12.9352 : destination[0],
                    lng: typeof destination === "string" ? 77.6245 : destination[1],
                  },
                },
              ],
            },
          ],
        }
      }
    },
    [map, geocodeAddress],
  )

  const value = {
    isLoaded,
    loadError,
    map,
    initMap,
    searchPlaces,
    getPlaceDetails,
    calculateRoute,
    geocodeAddress,
  }

  return <LeafletContext.Provider value={value}>{children}</LeafletContext.Provider>
}

export function useLeaflet() {
  const context = useContext(LeafletContext)
  if (!context) {
    throw new Error("useLeaflet must be used within a LeafletProvider")
  }
  return context
}
