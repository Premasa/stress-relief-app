"use client"

import { useEffect, useState } from "react"

const quotes = [
  "Take a deep breath and let go of the stress.",
  "You are stronger than you think.",
  "Every moment is a fresh beginning.",
  "Peace comes from within.",
  "Be gentle with yourself today."
]

interface HeaderProps {
  userName: string
}

export function Header({ userName }: HeaderProps) {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="pt-8 pb-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse" />
          
          <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="logoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              d="M50 15 C65 38 90 38 90 65 C90 90 65 95 50 90 C35 95 10 90 10 65 C10 38 35 38 50 15 Z"
              fill="url(#logoGrad)"
              filter="url(#glow)"
            />
            <path
              d="M50 30 C60 48 78 48 78 65 C78 82 62 87 50 82 C38 87 22 82 22 65 C22 48 40 48 50 30 Z"
              fill="url(#logoGrad2)"
              opacity="0.6"
            />
            <circle cx="50" cy="60" r="10" fill="white" opacity="0.9" />
            <circle cx="50" cy="60" r="5" fill="url(#logoGrad)" />
          </svg>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
        Serenity
      </h1>
      <p className="text-muted-foreground mt-2 text-lg">
        {userName ? (
          <span>
            Welcome back, <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{userName}</span>
          </span>
        ) : (
          "Your Personal Wellness Companion"
        )}
      </p>
      
      <div className="mt-4 py-3 px-6 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 rounded-full inline-block border border-violet-500/20">
        <p className="text-sm text-foreground/80 italic">{quote}</p>
      </div>
    </header>
  )
}
