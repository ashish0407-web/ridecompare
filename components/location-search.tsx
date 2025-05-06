"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mic, Locate, MapPin, X } from "lucide-react"
import { useLeaflet } from "@/components/leaflet-provider"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface LocationSearchProps {
  value: string
  onChange: (value: string, placeId?: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
  onVoiceInput?: () => void
  onLocationDetect?: () => void
  className?: string
  isListening?: boolean
  id?: string
}

export function LocationSearch({
  value,
  onChange,
  placeholder = "Enter location",
  onVoiceInput,
  onLocationDetect,
  className,
  isListening = false,
  id,
}: LocationSearchProps) {
  const [open, setOpen] = useState(false)
  const [predictions, setPredictions] = useState<any[]>([])
  const [inputValue, setInputValue] = useState(value)
  const { searchPlaces, getPlaceDetails, isLoaded } = useLeaflet()
  const { toast } = useToast()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Handle input change with debounce
  const handleInputChange = useCallback(
    (newValue: string) => {
      setInputValue(newValue)

      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set a new timer
      debounceTimerRef.current = setTimeout(async () => {
        if (newValue.length > 2 && isLoaded) {
          try {
            const results = await searchPlaces(newValue)
            setPredictions(results || [])
            if (results && results.length > 0) {
              setOpen(true)
            }
          } catch (error) {
            console.error("Error fetching predictions:", error)
            // Don't show error toast for search predictions to avoid spamming the user
            setPredictions([])
          }
        } else {
          setPredictions([])
        }
      }, 300) // 300ms debounce
    },
    [isLoaded, searchPlaces],
  )

  // Handle selection of a place
  const handleSelectPlace = useCallback(
    async (placeId: string, description: string, lat?: number, lng?: number) => {
      setInputValue(description)
      setOpen(false)

      // If we already have coordinates, use them directly
      if (lat !== undefined && lng !== undefined) {
        onChange(description, placeId, { lat, lng })
        return
      }

      try {
        const placeDetails = await getPlaceDetails(placeId)
        if (placeDetails && placeDetails.geometry && placeDetails.geometry.location) {
          const lat = placeDetails.geometry.location.lat
          const lng = placeDetails.geometry.location.lng
          onChange(description, placeId, { lat, lng })
        } else {
          onChange(description, placeId)
        }
      } catch (error) {
        console.error("Error getting place details:", error)
        onChange(description, placeId)
      }
    },
    [getPlaceDetails, onChange],
  )

  // Clear the input
  const handleClear = () => {
    setInputValue("")
    onChange("")
    setPredictions([])
  }

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />

      <Popover open={open && predictions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex-1 relative">
            <Input
              id={id}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              className="pr-8"
            />
            {inputValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-8 p-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup>
                {predictions.map((prediction) => (
                  <CommandItem
                    key={prediction.place_id}
                    onSelect={() =>
                      handleSelectPlace(prediction.place_id, prediction.description, prediction.lat, prediction.lon)
                    }
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {prediction.structured_formatting?.main_text || prediction.description.split(",")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {prediction.structured_formatting?.secondary_text ||
                          prediction.description.substring(prediction.description.indexOf(",") + 1).trim()}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex gap-1 flex-shrink-0">
        {onVoiceInput && (
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={onVoiceInput}
            className={cn(isListening ? "bg-primary text-primary-foreground" : "")}
          >
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice input</span>
          </Button>
        )}

        {onLocationDetect && (
          <Button variant="outline" size="icon" type="button" onClick={onLocationDetect}>
            <Locate className="h-4 w-4" />
            <span className="sr-only">Use current location</span>
          </Button>
        )}
      </div>
    </div>
  )
}
