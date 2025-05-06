"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// This would be your actual Google Maps API key in a real implementation
// For security, it should be stored in environment variables
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE"

type GoogleMapsContextType = {
  isLoaded: boolean
  loadError: string | null
  map: google.maps.Map | null
  autocompleteService: google.maps.places.AutocompleteService | null
  placesService: google.maps.places.PlacesService | null
  directionsService: google.maps.DirectionsService | null
  directionsRenderer: google.maps.DirectionsRenderer | null
  geocoder: google.maps.Geocoder | null
  searchPlaces: (input: string) => Promise<google.maps.places.AutocompletePrediction[]>
  getPlaceDetails: (placeId: string) => Promise<google.maps.places.PlaceResult | null>
  calculateRoute: (
    origin: google.maps.LatLngLiteral | string,
    destination: google.maps.LatLngLiteral | string,
    waypoints?: google.maps.DirectionsWaypoint[],
  ) => Promise<google.maps.DirectionsResult | null>
  initMap: (mapRef: HTMLElement, options?: google.maps.MapOptions) => void
}

const GoogleMapsContext = createContext<GoogleMapsContextType | null>(null)

// For TypeScript - declare the Google Maps types
declare global {
  interface Window {
    google: any
    initGoogleMapsCallback: () => void
  }
}

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null)
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const { toast } = useToast()

  // Load the Google Maps script
  useEffect(() => {
    if (window.google) {
      setIsLoaded(true)
      return
    }

    // This function will be called when the Google Maps script loads
    window.initGoogleMapsCallback = () => {
      setIsLoaded(true)
    }

    // In a real implementation, we would load the actual Google Maps script
    // For this demo, we'll simulate the loading
    const simulateScriptLoad = () => {
      // Simulate Google Maps API
      window.google = {
        maps: {
          Map: function (element: HTMLElement, options: any) {
            this.element = element
            this.options = options
            this.setCenter = (latLng: any) => {}
            this.setZoom = (zoom: number) => {}
            this.setOptions = (options: any) => {}
            this.panTo = (latLng: any) => {}
          },
          LatLng: function (lat: number, lng: number) {
            this.lat = lat
            this.lng = lng
          },
          Marker: function (options: any) {
            this.options = options
            this.setMap = (map: any) => {}
            this.setPosition = (latLng: any) => {}
          },
          places: {
            AutocompleteService: function () {
              this.getPlacePredictions = (request: any, callback: (predictions: any[], status: string) => void) => {
                // Simulate autocomplete results
                const predictions = [
                  {
                    place_id: "ChIJW_Wc1P8aDTkRQwlK7jqCUDQ",
                    description: "India Gate, New Delhi, India",
                    structured_formatting: {
                      main_text: "India Gate",
                      secondary_text: "New Delhi, India",
                    },
                  },
                  {
                    place_id: "ChIJx9Lr6tqZyzsRwLn-FG1XPOE",
                    description: "Charminar, Hyderabad, Telangana, India",
                    structured_formatting: {
                      main_text: "Charminar",
                      secondary_text: "Hyderabad, Telangana, India",
                    },
                  },
                  {
                    place_id: "ChIJbU60yXAWrjsR4E9-UejD3_g",
                    description: "Bangalore Palace, Bengaluru, Karnataka, India",
                    structured_formatting: {
                      main_text: "Bangalore Palace",
                      secondary_text: "Bengaluru, Karnataka, India",
                    },
                  },
                ]
                callback(predictions, "OK")
              }
            },
            PlacesService: function (map: any) {
              this.getDetails = (request: any, callback: (result: any, status: string) => void) => {
                // Simulate place details
                const result = {
                  name: "India Gate",
                  formatted_address: "Rajpath, India Gate, New Delhi, Delhi 110001, India",
                  geometry: {
                    location: {
                      lat: () => 28.612912,
                      lng: () => 77.227321,
                    },
                  },
                }
                callback(result, "OK")
              }
            },
            // Add PlacesServiceStatus with OK property
            PlacesServiceStatus: {
              OK: "OK",
              ZERO_RESULTS: "ZERO_RESULTS",
              OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
              REQUEST_DENIED: "REQUEST_DENIED",
              INVALID_REQUEST: "INVALID_REQUEST",
              UNKNOWN_ERROR: "UNKNOWN_ERROR",
            },
          },
          DirectionsService: function () {
            this.route = (request: any, callback: (result: any, status: string) => void) => {
              // Simulate directions result
              const result = {
                routes: [
                  {
                    legs: [
                      {
                        distance: { text: "5.2 km", value: 5200 },
                        duration: { text: "18 mins", value: 1080 },
                        start_location: { lat: 28.612912, lng: 77.227321 },
                        end_location: { lat: 28.632735, lng: 77.219869 },
                      },
                    ],
                    overview_polyline: {
                      points: "...", // Encoded polyline
                    },
                  },
                ],
              }
              callback(result, "OK")
            }
          },
          DirectionsStatus: {
            OK: "OK",
            NOT_FOUND: "NOT_FOUND",
            ZERO_RESULTS: "ZERO_RESULTS",
            MAX_WAYPOINTS_EXCEEDED: "MAX_WAYPOINTS_EXCEEDED",
            INVALID_REQUEST: "INVALID_REQUEST",
            OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
            REQUEST_DENIED: "REQUEST_DENIED",
            UNKNOWN_ERROR: "UNKNOWN_ERROR",
          },
          DirectionsRenderer: function () {
            this.setMap = (map: any) => {}
            this.setDirections = (directions: any) => {}
            this.setOptions = (options: any) => {}
          },
          Geocoder: function () {
            this.geocode = (request: any, callback: (results: any[], status: string) => void) => {
              // Simulate geocoding results
              const results = [
                {
                  geometry: {
                    location: {
                      lat: () => 28.612912,
                      lng: () => 77.227321,
                    },
                  },
                  formatted_address: "India Gate, Rajpath, India Gate, New Delhi, Delhi 110001, India",
                },
              ]
              callback(results, "OK")
            }
          },
          GeocoderStatus: {
            OK: "OK",
            ZERO_RESULTS: "ZERO_RESULTS",
            OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
            REQUEST_DENIED: "REQUEST_DENIED",
            INVALID_REQUEST: "INVALID_REQUEST",
            UNKNOWN_ERROR: "UNKNOWN_ERROR",
          },
          TravelMode: {
            DRIVING: "DRIVING",
            WALKING: "WALKING",
            BICYCLING: "BICYCLING",
            TRANSIT: "TRANSIT",
          },
          MapTypeId: {
            ROADMAP: "roadmap",
            SATELLITE: "satellite",
            HYBRID: "hybrid",
            TERRAIN: "terrain",
          },
        },
      }

      // Call the callback function
      window.initGoogleMapsCallback()
    }

    // Simulate loading delay
    setTimeout(simulateScriptLoad, 1000)

    return () => {
      // Cleanup
      window.initGoogleMapsCallback = () => {}
    }
  }, [])

  // Initialize services once Google Maps is loaded
  useEffect(() => {
    if (!isLoaded) return

    try {
      const autocomplete = new window.google.maps.places.AutocompleteService()
      setAutocompleteService(autocomplete)

      const directions = new window.google.maps.DirectionsService()
      setDirectionsService(directions)

      const directionsRender = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#3b82f6", // blue-500
          strokeWeight: 5,
        },
      })
      setDirectionsRenderer(directionsRender)

      const geocoderService = new window.google.maps.Geocoder()
      setGeocoder(geocoderService)

      // Places service needs a map element, so we'll set it later when we have a map
    } catch (error) {
      console.error("Error initializing Google Maps services:", error)
      setLoadError("Failed to initialize Google Maps services")
      toast({
        title: "Maps Error",
        description: "Failed to initialize Google Maps services. Some features may not work properly.",
        variant: "destructive",
      })
    }
  }, [isLoaded, toast])

  // Initialize map
  const initMap = useCallback(
    (mapRef: HTMLElement, options: google.maps.MapOptions = {}) => {
      if (!isLoaded || !window.google) return

      try {
        // Default map options
        const defaultOptions: google.maps.MapOptions = {
          center: { lat: 20.5937, lng: 78.9629 }, // Center of India
          zoom: 5,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          ...options,
        }

        // Create the map
        const newMap = new window.google.maps.Map(mapRef, defaultOptions)
        setMap(newMap)

        // Initialize PlacesService with the map
        if (newMap) {
          const places = new window.google.maps.places.PlacesService(newMap)
          setPlacesService(places)

          // Set the map for the directions renderer
          if (directionsRenderer) {
            directionsRenderer.setMap(newMap)
          }
        }

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
    [isLoaded, directionsRenderer, toast],
  )

  // Search for places using the Autocomplete service
  const searchPlaces = useCallback(
    async (input: string): Promise<google.maps.places.AutocompletePrediction[]> => {
      if (!autocompleteService || !isLoaded || !window.google) {
        return []
      }

      try {
        return new Promise((resolve, reject) => {
          autocompleteService.getPlacePredictions(
            {
              input,
              componentRestrictions: { country: "in" }, // Restrict to India
              types: ["geocode", "establishment"],
            },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                resolve(predictions)
              } else {
                resolve([])
              }
            },
          )
        })
      } catch (error) {
        console.error("Error searching places:", error)
        return []
      }
    },
    [autocompleteService, isLoaded],
  )

  // Get place details using the Places service
  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<google.maps.places.PlaceResult | null> => {
      if (!placesService || !isLoaded || !window.google) {
        return null
      }

      try {
        return new Promise((resolve, reject) => {
          placesService.getDetails(
            {
              placeId,
              fields: ["name", "formatted_address", "geometry", "place_id"],
            },
            (result, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                resolve(result)
              } else {
                resolve(null)
              }
            },
          )
        })
      } catch (error) {
        console.error("Error getting place details:", error)
        return null
      }
    },
    [placesService, isLoaded],
  )

  // Calculate route using the Directions service
  const calculateRoute = useCallback(
    async (
      origin: google.maps.LatLngLiteral | string,
      destination: google.maps.LatLngLiteral | string,
      waypoints?: google.maps.DirectionsWaypoint[],
    ): Promise<google.maps.DirectionsResult | null> => {
      if (!directionsService || !directionsRenderer || !isLoaded || !window.google) {
        return null
      }

      try {
        return new Promise((resolve, reject) => {
          directionsService.route(
            {
              origin,
              destination,
              waypoints: waypoints || [],
              travelMode: window.google.maps.TravelMode.DRIVING,
              optimizeWaypoints: true,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK && result) {
                // Display the route on the map
                if (directionsRenderer) {
                  directionsRenderer.setDirections(result)
                }
                resolve(result)
              } else {
                resolve(null)
              }
            },
          )
        })
      } catch (error) {
        console.error("Error calculating route:", error)
        return null
      }
    },
    [directionsService, directionsRenderer, isLoaded],
  )

  const value = {
    isLoaded,
    loadError,
    map,
    autocompleteService,
    placesService,
    directionsService,
    directionsRenderer,
    geocoder,
    searchPlaces,
    getPlaceDetails,
    calculateRoute,
    initMap,
  }

  return <GoogleMapsContext.Provider value={value}>{children}</GoogleMapsContext.Provider>
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider")
  }
  return context
}
