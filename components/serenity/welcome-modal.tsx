"use client"

import React from "react"
import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

interface WelcomeModalProps {
  onStart: (name: string) => void
}

export function WelcomeModal({ onStart }: WelcomeModalProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart(name || "Friend")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Colorful animated background */}
      <div className="absolute inset-0 gradient-bg opacity-30" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-500 border border-white/20">
        {/* Gradient border effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-3xl opacity-50 blur-sm -z-10" />
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full blur-2xl opacity-60 animate-pulse scale-150" />
            
            <svg viewBox="0 0 100 100" className="w-24 h-24 relative z-10">
              <defs>
                <linearGradient id="modalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="modalGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#modalGradient)" strokeWidth="3" />
              <path
                d="M50 20 C65 42 88 42 88 65 C88 88 65 93 50 88 C35 93 12 88 12 65 C12 42 35 42 50 20 Z"
                fill="url(#modalGradient)"
              />
              <path
                d="M50 32 C60 48 75 48 75 62 C75 78 62 82 50 78 C38 82 25 78 25 62 C25 48 40 48 50 32 Z"
                fill="url(#modalGradient2)"
                opacity="0.6"
              />
              <circle cx="50" cy="58" r="8" fill="white" opacity="0.9" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Welcome
          </h2>
          <Sparkles className="w-5 h-5 text-pink-500" />
        </div>
        <p className="text-muted-foreground text-center mb-6 text-lg">Begin your journey to serenity</p>
        
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-xl opacity-50 blur-sm" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              className="relative w-full px-5 py-4 bg-background rounded-xl border-2 border-transparent focus:border-violet-500 outline-none transition-all text-foreground placeholder:text-muted-foreground text-lg"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="relative w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 overflow-hidden group"
          >
            {/* Button gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <span className="relative z-10 text-white">Begin Journey</span>
            <ArrowRight className="relative z-10 w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  )
}
