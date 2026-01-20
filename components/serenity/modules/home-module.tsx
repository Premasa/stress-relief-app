"use client"

import { useEffect, useState } from "react"
import { Wind, Music, Gamepad2, Smile } from "lucide-react"
import type { ModuleType } from "@/app/page"

const tips = [
  "Take regular breaks throughout your day. Even 5 minutes can make a big difference!",
  "Practice deep breathing when you feel stressed. It activates your parasympathetic nervous system.",
  "Stay hydrated! Dehydration can increase cortisol levels and stress.",
  "Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
  "A short walk can help clear your mind and reduce anxiety.",
  "Stretching for just 5 minutes can release tension in your muscles.",
]

interface HomeModuleProps {
  userName: string
  onQuickAction: (action: ModuleType) => void
}

export function HomeModule({ userName, onQuickAction }: HomeModuleProps) {
  const [tip, setTip] = useState("")

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  const quickActions = [
    { 
      id: "breathing" as ModuleType, 
      icon: <Wind className="w-10 h-10" />, 
      title: "Quick Breathing", 
      desc: "2-minute guided exercise",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10"
    },
    { 
      id: "sounds" as ModuleType, 
      icon: <Music className="w-10 h-10" />, 
      title: "Calming Sounds", 
      desc: "Relax with nature",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    { 
      id: "games" as ModuleType, 
      icon: <Gamepad2 className="w-10 h-10" />, 
      title: "Stress Relief", 
      desc: "Play a quick game",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    },
    { 
      id: "mood" as ModuleType, 
      icon: <Smile className="w-10 h-10" />, 
      title: "Track Mood", 
      desc: "How are you feeling?",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/10 to-rose-500/10"
    },
  ]

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Welcome Back
          {userName && (
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              , {userName}
            </span>
          )}
          !
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Take a moment for yourself. Choose an activity to help you relax and recharge.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onQuickAction(action.id)}
            className={`relative p-6 bg-gradient-to-br ${action.bgGradient} rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group overflow-hidden border border-white/10`}
          >
            {/* Hover gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className={`bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent mx-auto w-fit group-hover:scale-110 transition-transform duration-300`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-foreground mt-3">{action.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
            
            {/* Bottom gradient line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl p-6 border border-violet-500/20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 animate-gradient bg-[length:200%_auto]" />
        
        <div className="relative z-10">
          <h3 className="font-bold text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent mb-2">
            Daily Wellness Tip
          </h3>
          <p className="text-foreground/80">{tip}</p>
        </div>
      </div>
    </section>
  )
}
