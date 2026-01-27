"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Bell, BellOff } from "lucide-react"

export function RemindersModule() {
  const [interval, setInterval_] = useState(30)
  const [enabled, setEnabled] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playNotification = useCallback(() => {
    // Create a gentle notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch {
      console.log("[v0] Audio notification not supported")
    }

    // Also show browser notification if permitted
    if (Notification.permission === "granted") {
      new Notification("Time for a break!", {
        body: "Take a moment to stretch, breathe, and relax.",
        icon: "/icon.svg",
      })
    }
  }, [])

  const startTimer = useCallback(() => {
    setTimeLeft(interval * 60)
    
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playNotification()
          return interval * 60
        }
        return prev - 1
      })
    }, 1000)
  }, [interval, playNotification])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setTimeLeft(0)
  }, [])

  useEffect(() => {
    if (enabled) {
      // Request notification permission
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
      startTimer()
    } else {
      stopTimer()
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, startTimer, stopTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleIntervalChange = (newInterval: number) => {
    setInterval_(newInterval)
    if (enabled) {
      setTimeLeft(newInterval * 60)
    }
  }

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Break Reminders</h2>
        <p className="text-muted-foreground mt-2">Set regular breaks to stay refreshed</p>
      </div>

      <div className="max-w-md mx-auto bg-card rounded-xl p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Reminder Interval:</label>
          <select
            value={interval}
            onChange={(e) => handleIntervalChange(Number(e.target.value))}
            className="w-full p-3 bg-muted rounded-lg border border-border text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="15">Every 15 minutes</option>
            <option value="30">Every 30 minutes</option>
            <option value="60">Every 60 minutes</option>
            <option value="90">Every 90 minutes</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            {enabled ? (
              <Bell className="w-5 h-5 text-indigo-500" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="font-medium text-foreground">
              {enabled ? "Reminders On" : "Reminders Off"}
            </span>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              enabled ? "bg-indigo-500" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                enabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {enabled && (
          <div className="text-center py-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
            <p className="text-sm text-muted-foreground mb-2">Next break in:</p>
            <p className="text-4xl font-bold text-indigo-500">{formatTime(timeLeft)}</p>
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3">Why Take Breaks?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Reduces eye strain and physical tension
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Improves focus and productivity
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Prevents burnout and mental fatigue
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Boosts creativity and problem-solving
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
