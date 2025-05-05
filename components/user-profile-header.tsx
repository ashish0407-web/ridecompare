import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Settings } from "lucide-react"

export function UserProfileHeader() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
      <Avatar className="w-24 h-24 border-4 border-background">
        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="@johndoe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>

      <div className="flex-grow text-center md:text-left">
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-muted-foreground">Member since May 2023</p>
        <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
          <div className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">15 Rides</div>
          <div className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">4 Saved Routes</div>
          <div className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">Premium Member</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
