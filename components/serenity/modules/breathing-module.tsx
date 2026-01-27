"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type Pattern = "478" | "box" | "calm"

interface BreathingPattern {
  name: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
}

const patterns: Record<Pattern, BreathingPattern> = {
  "478": { name: "4-7-8 Breathing", inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  box: { name: "Box Breathing", inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  calm: { name: "Calm Breathing", inhale: 4, hold1: 2, exhale: 6, hold2: 0 },
}

export function BreathingModule() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>("478")
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")
  const [counter, setCounter] = useState(0)
  const [scale, setScale] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pattern = patterns[selectedPattern]

  const getPhaseText = useCallback(() => {
    switch (phase) {
      case "inhale": return "Breathe In"
      case "hold1": return "Hold"
      case "exhale": return "Breathe Out"
      case "hold2": return "Hold"
      default: return "Breathe"
    }
  }, [phase])

  useEffect(() => {
    if (!isRunning) {
      setScale(1)
      return
    }

    const totalCycle = pattern.inhale + pattern.hold1 + pattern.exhale + pattern.hold2

    let elapsed = 0
    setPhase("inhale")
    setCounter(pattern.inhale)

    intervalRef.current = setInterval(() => {
      elapsed++
      const cycleTime = elapsed % totalCycle

      if (cycleTime < pattern.inhale) {
        setPhase("inhale")
        setCounter(pattern.inhale - cycleTime)
        setScale(1 + (cycleTime / pattern.inhale) * 0.5)
      } else if (cycleTime < pattern.inhale + pattern.hold1) {
        setPhase("hold1")
        setCounter(pattern.hold1 - (cycleTime - pattern.inhale))
        setScale(1.5)
      } else if (cycleTime < pattern.inhale + pattern.hold1 + pattern.exhale) {
        setPhase("exhale")
        setCounter(pattern.exhale - (cycleTime - pattern.inhale - pattern.hold1))
        const exhaleProgress = (cycleTime - pattern.inhale - pattern.hold1) / pattern.exhale
        setScale(1.5 - exhaleProgress * 0.5)
      } else {
        setPhase("hold2")
        setCounter(pattern.hold2 - (cycleTime - pattern.inhale - pattern.hold1 - pattern.exhale))
        setScale(1)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, pattern])

  const handleStop = () => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPhase("inhale")
    setCounter(0)
    setScale(1)
  }

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Guided Breathing</h2>
        <p className="text-muted-foreground mt-2">Follow the circle and breathe deeply</p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${scale})` }}
          />
          <div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500/50 to-purple-500/50 transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${scale})` }}
          />
          <div
            className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center transition-transform duration-1000 ease-in-out shadow-lg"
            style={{ transform: `scale(${scale})` }}
          >
            <div className="text-center text-white">
              <p className="text-lg font-medium">{isRunning ? getPhaseText() : "Ready"}</p>
              {isRunning && <p className="text-3xl font-bold">{counter}</p>}
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Choose Pattern:</label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value as Pattern)}
              disabled={isRunning}
              className="w-full p-3 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
            >
              <option value="478">4-7-8 Breathing (Relaxation)</option>
              <option value="box">Box Breathing (Focus)</option>
              <option value="calm">Calm Breathing (Quick Relief)</option>
            </select>
          </div>

          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Exercise
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-full py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
