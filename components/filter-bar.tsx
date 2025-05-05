"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function FilterBar() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [etaRange, setEtaRange] = useState([0, 20])
  const [activeFilters, setActiveFilters] = useState(0)

  const updateActiveFilters = () => {
    // In a real app, we would count all active filters
    setActiveFilters(5)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filters</CardTitle>
        {activeFilters > 0 && <Badge variant="secondary">{activeFilters} active</Badge>}
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={["price", "providers", "rideType"]}>
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="pt-4">
                  <Slider
                    defaultValue={[0, 500]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="eta">
            <AccordionTrigger>ETA</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="pt-4">
                  <Slider defaultValue={[0, 20]} max={30} step={1} value={etaRange} onValueChange={setEtaRange} />
                </div>
                <div className="flex justify-between text-sm">
                  <span>{etaRange[0]} min</span>
                  <span>{etaRange[1]} min</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="providers">
            <AccordionTrigger>Providers</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="uber" defaultChecked />
                  <Label htmlFor="uber">Uber</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ola" defaultChecked />
                  <Label htmlFor="ola">Ola</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rapido" defaultChecked />
                  <Label htmlFor="rapido">Rapido</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="meru" defaultChecked />
                  <Label htmlFor="meru">Meru</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="jugnoo" defaultChecked />
                  <Label htmlFor="jugnoo">Jugnoo</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rideType">
            <AccordionTrigger>Ride Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sedan" defaultChecked />
                  <Label htmlFor="sedan">Sedan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto" defaultChecked />
                  <Label htmlFor="auto">Auto</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="bike" defaultChecked />
                  <Label htmlFor="bike">Bike</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="premium" defaultChecked />
                  <Label htmlFor="premium">Premium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="suv" defaultChecked />
                  <Label htmlFor="suv">SUV</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="eco-friendly">Eco-friendly options</Label>
                  <Switch id="eco-friendly" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="discounts">Show discounts only</Label>
                  <Switch id="discounts" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="accessibility">Wheelchair accessible</Label>
                  <Switch id="accessibility" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pets">Pet friendly</Label>
                  <Switch id="pets" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ac">AC only</Label>
                  <Switch id="ac" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cashless">Cashless payment</Label>
                  <Switch id="cashless" defaultChecked />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ratings">
            <AccordionTrigger>Driver Ratings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating-4.5" defaultChecked />
                  <Label htmlFor="rating-4.5">4.5+ Stars</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating-4.0" defaultChecked />
                  <Label htmlFor="rating-4.0">4.0+ Stars</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating-3.5" />
                  <Label htmlFor="rating-3.5">3.5+ Stars</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 flex gap-2">
          <Button variant="outline" className="w-1/2">
            Reset
          </Button>
          <Button className="w-1/2" onClick={updateActiveFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
