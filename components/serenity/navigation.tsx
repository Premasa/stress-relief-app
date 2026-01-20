"use client"

import React from "react"
import { Home, Wind, Music, Gamepad2, BarChart3, MessageSquare, Clock } from "lucide-react"
import type { ModuleType } from "@/app/page"

interface NavigationProps {
  activeModule: ModuleType
  onModuleChange: (module: ModuleType) => void
}

const navItems: { id: ModuleType; label: string; icon: React.ReactNode; gradient: string }[] = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, gradient: "from-violet-500 to-purple-500" },
  { id: "breathing", label: "Breathe", icon: <Wind className="w-5 h-5" />, gradient: "from-cyan-500 to-blue-500" },
  { id: "sounds", label: "Sounds", icon: <Music className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500" },
  { id: "games", label: "Games", icon: <Gamepad2 className="w-5 h-5" />, gradient: "from-orange-500 to-red-500" },
  { id: "mood", label: "Mood", icon: <BarChart3 className="w-5 h-5" />, gradient: "from-pink-500 to-rose-500" },
  { id: "quotes", label: "Quotes", icon: <MessageSquare className="w-5 h-5" />, gradient: "from-amber-500 to-yellow-500" },
  { id: "reminders", label: "Breaks", icon: <Clock className="w-5 h-5" />, gradient: "from-teal-500 to-cyan-500" },
]

export function Navigation({ activeModule, onModuleChange }: NavigationProps) {
  return (
    <nav className="flex flex-wrap justify-center gap-2 p-3 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onModuleChange(item.id)}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 overflow-hidden ${
            activeModule === item.id
              ? "text-white shadow-lg scale-105"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {/* Active gradient background */}
          {activeModule === item.id && (
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} animate-gradient bg-[length:200%_auto]`} />
          )}
          
          {/* Hover glow */}
          {activeModule === item.id && (
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} blur-xl opacity-50`} />
          )}
          
          <span className="relative z-10">{item.icon}</span>
          <span className="relative z-10 text-sm font-medium hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
