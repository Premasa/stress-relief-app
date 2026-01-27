"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const patterns = [
  { name: "Box Breathing", inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { name: "4-7-8 Relaxing", inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  { name: "Calm Breath", inhale: 4, hold1: 2, exhale: 6, hold2: 0 },
  { name: "Energizing", inhale: 6, hold1: 0, exhale: 2, hold2: 0 },
]

export function BreathingBallGame() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")
  const [timer, setTimer] = useState(0)
  const [totalBreaths, setTotalBreaths] = useState(0)
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const phaseStartRef = useRef<number>(0)

  const pattern = patterns[selectedPattern]
  
  const getPhaseDuration = (p: typeof phase) => {
    switch (p) {
      case "inhale": return pattern.inhale
      case "hold1": return pattern.hold1
      case "exhale": return pattern.exhale
      case "hold2": return pattern.hold2
    }
  }

  const getNextPhase = (p: typeof phase): typeof phase => {
    switch (p) {
      case "inhale": return pattern.hold1 > 0 ? "hold1" : "exhale"
      case "hold1": return "exhale"
      case "exhale": return pattern.hold2 > 0 ? "hold2" : "inhale"
      case "hold2": return "inhale"
    }
  }

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale": return "Breathe In"
      case "hold1": return "Hold"
      case "exhale": return "Breathe Out"
      case "hold2": return "Hold"
    }
  }

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(animationRef.current)
      return
    }

    const duration = getPhaseDuration(phase) * 1000
    phaseStartRef.current = performance.now()

    const animate = (timestamp: number) => {
      const elapsed = timestamp - phaseStartRef.current
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000))
      setTimer(remaining)

      if (elapsed >= duration) {
        const nextPhase = getNextPhase(phase)
        if (phase === "exhale" || (phase === "hold2" && pattern.hold2 > 0)) {
          setTotalBreaths(prev => prev + 1)
        }
        setPhase(nextPhase)
      } else {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [isActive, phase, selectedPattern])

  const toggleActive = () => {
    if (!isActive) {
      setPhase("inhale")
      setTimer(pattern.inhale)
      startTimeRef.current = performance.now()
    }
    setIsActive(!isActive)
  }

  const reset = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimer(0)
    setTotalBreaths(0)
  }

  const getScale = () => {
    if (!isActive) return 1
    const duration = getPhaseDuration(phase)
    const elapsed = (duration - timer) / duration
    
    switch (phase) {
      case "inhale": return 1 + elapsed * 0.5
      case "hold1": return 1.5
      case "exhale": return 1.5 - elapsed * 0.5
      case "hold2": return 1
    }
  }

  const getGradient = () => {
    switch (phase) {
      case "inhale": return "from-sky-400 to-cyan-500"
      case "hold1": return "from-violet-400 to-purple-500"
      case "exhale": return "from-emerald-400 to-teal-500"
      case "hold2": return "from-amber-400 to-orange-500"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 relative">
      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-0 left-0 right-0 bg-card border border-border rounded-2xl p-4 z-10 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-medium text-foreground mb-3">Breathing Pattern</h3>
          <div className="space-y-2">
            {patterns.map((p, i) => (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedPattern(i)
                  reset()
                  setShowSettings(false)
                }}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  i === selectedPattern
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <p className="font-medium">{p.name}</p>
                <p className="text-xs opacity-70">
                  In {p.inhale}s {p.hold1 > 0 && `• Hold ${p.hold1}s`} • Out {p.exhale}s {p.hold2 > 0 && `• Hold ${p.hold2}s`}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between w-full max-w-sm mb-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Breaths</p>
          <p className="text-2xl font-bold text-foreground">{totalBreaths}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          className="rounded-full"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-2">{pattern.name}</p>

      {/* Breathing Ball */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-muted opacity-30" />
        
        {/* Animated ball */}
        <div
          className={`rounded-full bg-gradient-to-br ${getGradient()} shadow-lg transition-all duration-1000 ease-in-out flex items-center justify-center`}
          style={{
            width: `${getScale() * 120}px`,
            height: `${getScale() * 120}px`,
            boxShadow: isActive ? `0 0 60px 20px rgba(99, 102, 241, 0.2)` : undefined,
          }}
        >
          <div className="text-center text-white">
            <p className="text-3xl font-bold">{isActive ? timer : "Ready"}</p>
            <p className="text-sm opacity-90">{isActive ? getPhaseInstruction() : "Press Start"}</p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {["inhale", "hold1", "exhale", "hold2"].map((p) => {
          if (p === "hold1" && pattern.hold1 === 0) return null
          if (p === "hold2" && pattern.hold2 === 0) return null
          return (
            <div
              key={p}
              className={`w-3 h-3 rounded-full transition-all ${
                phase === p && isActive ? "bg-primary scale-125" : "bg-muted"
              }`}
            />
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button onClick={toggleActive} size="lg" className="gap-2 px-8">
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center max-w-xs">
        Follow the ball as it expands and contracts. Breathe in sync with its movement.
      </p>
    </div>
  )
}
