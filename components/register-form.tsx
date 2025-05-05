"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Mail, Phone } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RegisterForm() {
  const router = useRouter()
  const { register, loginWithGoogle, loginWithPhone } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(name, email, password)
      toast({
        title: "Registration successful",
        description: "Welcome to RideCompare India!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your details and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)

    try {
      await loginWithGoogle()
      toast({
        title: "Registration successful",
        description: "Welcome to RideCompare India!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Google registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsOtpSent(true)
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${phoneNumber}`,
      })
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await loginWithPhone(phoneNumber, otp)
      toast({
        title: "Registration successful",
        description: "Welcome to RideCompare India!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Sign up for RideCompare India</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone-register">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone-register"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={isOtpSent}
                  />
                  {!isOtpSent && (
                    <Button type="button" variant="outline" onClick={handleSendOtp} disabled={isLoading}>
                      Send OTP
                    </Button>
                  )}
                </div>
              </div>

              {isOtpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp-register">Enter OTP</Label>
                  <Input
                    id="otp-register"
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <div className="text-sm text-right">
                    <Button type="button" variant="link" className="h-auto p-0" onClick={() => setIsOtpSent(false)}>
                      Change phone number
                    </Button>
                  </div>
                </div>
              )}

              {isOtpSent && (
                <div className="space-y-2">
                  <Label htmlFor="name-phone">Full Name</Label>
                  <Input
                    id="name-phone"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox id="terms-phone" required />
                <Label htmlFor="terms-phone" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {isOtpSent && (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </Button>
              )}
            </form>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              <Mail className="h-4 w-4" />
              <span>Sign up with Google</span>
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2" disabled={isLoading}>
              <Phone className="h-4 w-4" />
              <span>Sign up with Truecaller</span>
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2" disabled={isLoading}>
              <Github className="h-4 w-4" />
              <span>Sign up with GitHub</span>
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
