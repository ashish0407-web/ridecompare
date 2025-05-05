"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Coordinates = {
  latitude: number
  longitude: number
}

type LocationContextType = {
  currentLocation: Coordinates | null
  isLoading: boolean
  error: string | null
  requestLocation: () => Promise<void>
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("User denied the request for geolocation")
            break
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable")
            break
          case err.TIMEOUT:
            setError("The request to get user location timed out")
            break
          default:
            setError("An unknown error occurred")
            break
        }
      } else {
        setError("Failed to get location")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Default to Bangalore coordinates if location not available
  useEffect(() => {
    if (!currentLocation) {
      // Bangalore coordinates
      setCurrentLocation({
        latitude: 12.9716,
        longitude: 77.5946,
      })
    }
  }, [currentLocation])

  return (
    <LocationContext.Provider value={{ currentLocation, isLoading, error, requestLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
