"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Car, Menu, User, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { LanguageSelector } from "@/components/language-selector"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden md:inline-block">RideCompare India</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), isActive("/") && "bg-accent text-accent-foreground")}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Car className="h-6 w-6 text-white" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">RideCompare India</div>
                          <p className="text-sm leading-tight text-white/90">
                            Compare ride fares across Uber, Ola, Rapido across India
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link href="/features/fare-comparison" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Fare Comparison</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Compare prices across multiple ride providers
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/features/surge-prediction" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Surge Prediction</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            AI-powered surge prediction with fare forecasts
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/features/multi-route" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Multi-Route</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Compare fares for trips with multiple stops
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/about") && "bg-accent text-accent-foreground",
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ModeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email || user.phone}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Home
                  </Button>
                </Link>
                <Link href="/features" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Features
                  </Button>
                </Link>
                <Link href="/about" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    About
                  </Button>
                </Link>
                <div className="h-px bg-border my-2" />
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email || user.phone}</p>
                      </div>
                    </div>
                    <Link href="/profile" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      className="w-full"
                      onClick={() => {
                        logout()
                        setOpen(false)
                      }}
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
                <div className="h-px bg-border my-2" />
                <div className="px-3">
                  <LanguageSelector />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
