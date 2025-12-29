"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "../src/config/firebase"
import type { User } from "../types"
import { strapiService } from "../services/strapiService"

interface AuthContextType {
  currentUser: FirebaseUser | null
  userData: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = await strapiService.getUserByEmail(email)
      setUserData(user)
    } catch (error: any) {
      throw new Error("Greška pri prijavljivanju: " + error.message)
    }
  }

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Create user in Strapi
      const newUser = await strapiService.createUser({
        email,
        name,
      })

      setUserData(newUser)
    } catch (error: any) {
      throw new Error("Greška pri registraciji: " + error.message)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      setUserData(null)
    } catch (error: any) {
      throw new Error("Greška pri odjavljivanju: " + error.message)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        // Fetch user data from Strapi
        const userData = await strapiService.getUserByEmail(user.email!)
        setUserData(userData)
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    userData,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
