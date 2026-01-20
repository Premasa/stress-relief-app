"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

const PRESETS = [
  { name: "Quick Focus", work: 15, break: 3 },
  { name: "Pomodoro", work: 25, break: 5 },
  { name: "Deep Work", work: 50, break: 10 },
]

export function FocusTimerGame() {
  const [mode, setMode] = useState<"work" | "break">("work")
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(1)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContext = useRef<AudioContext | null>(null)

  const preset = PRESETS[selectedPreset]

  const playSound = (frequency: number, duration: number) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }
    const ctx = audioContext.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = "sine"
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    
    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
        if (mode === "work") {
          setTotalFocusTime(prev => prev + 1)
        }
      }, 1000)
    } else if (timeLeft === 0) {
      playSound(mode === "work" ? 523.25 : 392, 0.5)
      
      if (mode === "work") {
        setSessionsCompleted(prev => prev + 1)
        setMode("break")
        setTimeLeft(preset.break * 60)
      } else {
        setMode("work")
        setTimeLeft(preset.work * 60)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, mode, preset])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMode("work")
    setTimeLeft(preset.work * 60)
  }

  const changePreset = (index: number) => {
    setSelectedPreset(index)
    setIsActive(false)
    setMode("work")
    setTimeLeft(PRESETS[index].work * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const progress = mode === "work"
    ? 1 - timeLeft / (preset.work * 60)
    : 1 - timeLeft / (preset.break * 60)

  const circumference = 2 * Math.PI * 120

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      {/* Stats */}
      <div className="flex items-center justify-center gap-8 mb-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Sessions</p>
          <p className="text-2xl font-bold text-foreground">{sessionsCompleted}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Focus Time</p>
          <p className="text-2xl font-bold text-primary">{formatTotalTime(totalFocusTime)}</p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex gap-2 mb-6">
        {PRESETS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => changePreset(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i === selectedPreset
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={mode === "work" ? "text-primary" : "text-emerald-500"}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`p-3 rounded-full mb-2 ${
            mode === "work" ? "bg-primary/10" : "bg-emerald-500/10"
          }`}>
            {mode === "work" ? (
              <Brain className={`w-6 h-6 ${mode === "work" ? "text-primary" : "text-emerald-500"}`} />
            ) : (
              <Coffee className="w-6 h-6 text-emerald-500" />
            )}
          </div>
          <p className="text-4xl font-bold text-foreground tabular-nums">
            {formatTime(timeLeft)}
          </p>
          <p className={`text-sm font-medium ${
            mode === "work" ? "text-primary" : "text-emerald-500"
          }`}>
            {mode === "work" ? "Focus Time" : "Break Time"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button onClick={toggleTimer} size="lg" className="gap-2 px-8">
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              {timeLeft === preset.work * 60 || timeLeft === preset.break * 60 ? "Start" : "Resume"}
            </>
          )}
        </Button>
        <Button onClick={resetTimer} variant="outline" size="lg">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center max-w-xs">
        Focus for {preset.work} minutes, then take a {preset.break} minute break
      </p>
    </div>
  )
}
