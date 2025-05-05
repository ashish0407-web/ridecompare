"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithPhone: (phone: string, otp: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    // Simulate checking local storage or cookies for auth token
    const checkAuth = async () => {
      try {
        // For demo purposes, we'll just check if there's a user in localStorage
        const savedUser = localStorage.getItem("ridecompare_user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Auth error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "user_123",
        name: "Test User",
        email: email,
      }

      setUser(userData)
      localStorage.setItem("ridecompare_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Mock Google login
  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "user_google_123",
        name: "Google User",
        email: "google.user@example.com",
        avatar: "/placeholder.svg?height=200&width=200",
      }

      setUser(userData)
      localStorage.setItem("ridecompare_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Mock phone login
  const loginWithPhone = async (phone: string, otp: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "user_phone_123",
        name: "Phone User",
        email: "",
        phone: phone,
      }

      setUser(userData)
      localStorage.setItem("ridecompare_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Phone login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "user_" + Date.now(),
        name: name,
        email: email,
      }

      setUser(userData)
      localStorage.setItem("ridecompare_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("ridecompare_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, loginWithPhone, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
