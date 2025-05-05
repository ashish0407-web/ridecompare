"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, CreditCard } from "lucide-react"

export function ProfileTabs() {
  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="history">Ride History</TabsTrigger>
        <TabsTrigger value="saved">Saved Routes</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ride History</CardTitle>
            <CardDescription>View your past rides and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt="Provider logo" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">Uber - UberX</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>May {i}, 2023 - 2:30 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>123 Main St → 456 Broadway</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">${(12 + i).toFixed(2)}</span>
                        <div className="text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="ml-2">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="saved" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Routes</CardTitle>
            <CardDescription>Quick access to your frequent routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{i === 1 ? "Home to Work" : "Work to Home"}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{i === 1 ? "123 Main St → Office Building" : "Office Building → 123 Main St"}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Last used: 2 days ago</span>
                        </div>
                      </div>
                      <div>
                        <Button size="sm">Compare Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Add New Route
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ride Preferences</CardTitle>
            <CardDescription>Customize your ride experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Default Filters</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-eco">Prefer eco-friendly options</Label>
                    <Switch id="pref-eco" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-price">Sort by price (lowest first)</Label>
                    <Switch id="pref-price" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pref-time">Prioritize shorter wait times</Label>
                    <Switch id="pref-time" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-price">Price drop alerts</Label>
                    <Switch id="notif-price" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-surge">Surge pricing warnings</Label>
                    <Switch id="notif-surge" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-promo">Promotions and discounts</Label>
                    <Switch id="notif-promo" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Preferred Providers</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="provider-uber">Uber</Label>
                    <Switch id="provider-uber" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="provider-ola">Ola</Label>
                    <Switch id="provider-ola" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="provider-rapido">Rapido</Label>
                    <Switch id="provider-rapido" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="provider-lyft">Lyft</Label>
                    <Switch id="provider-lyft" defaultChecked />
                  </div>
                </div>
              </div>

              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Full Name</Label>
                    <Input id="account-name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-email">Email</Label>
                    <Input id="account-email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-phone">Phone Number</Label>
                    <Input id="account-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-language">Language</Label>
                    <Input id="account-language" defaultValue="English" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Security</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Payment Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/25</div>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Data & Privacy</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-location">Share location data</Label>
                    <Switch id="data-location" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-analytics">Allow usage analytics</Label>
                    <Switch id="data-analytics" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-marketing">Receive marketing emails</Label>
                    <Switch id="data-marketing" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button>Save Changes</Button>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
