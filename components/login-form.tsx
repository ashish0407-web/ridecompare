"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Mail, Phone } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const router = useRouter()
  const { login, loginWithGoogle, loginWithPhone } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Login successful",
        description: "Welcome back to RideCompare India!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      await loginWithGoogle()
      toast({
        title: "Login successful",
        description: "Welcome back to RideCompare India!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Google login failed. Please try again.",
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

  const handlePhoneLogin = async (e: React.FormEvent) => {
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
        title: "Login successful",
        description: "Welcome back to RideCompare India!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
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
        <CardTitle>Login to RideCompare India</CardTitle>
        <CardDescription>Enter your details to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4 mt-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
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
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
              )}
            </form>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Mail className="h-4 w-4" />
              <span>Continue with Google</span>
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2" disabled={isLoading}>
              <Phone className="h-4 w-4" />
              <span>Continue with Truecaller</span>
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2" disabled={isLoading}>
              <Github className="h-4 w-4" />
              <span>Continue with GitHub</span>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
