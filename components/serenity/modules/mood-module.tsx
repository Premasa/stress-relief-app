"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface MoodEntry {
  id: string
  mood: number
  note: string
  timestamp: number
}

const moodLabels: Record<number, { label: string; color: string; emoji: string }> = {
  5: { label: "Excellent", color: "#34d399", emoji: "😄" },
  4: { label: "Good", color: "#38bdf8", emoji: "🙂" },
  3: { label: "Okay", color: "#fbbf24", emoji: "😐" },
  2: { label: "Not Great", color: "#fb923c", emoji: "😕" },
  1: { label: "Stressed", color: "#f87171", emoji: "😫" },
}

export function MoodModule() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState("")
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("serenity-moods")
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = 200
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (entries.length < 2) {
      ctx.fillStyle = "#6b7280"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Log more moods to see your chart", canvas.width / 2, canvas.height / 2)
      return
    }

    const lastEntries = entries.slice(-14)
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const pointSpacing = chartWidth / (lastEntries.length - 1)

    // Draw grid lines
    ctx.strokeStyle = "rgba(107, 114, 128, 0.2)"
    ctx.lineWidth = 1
    for (let i = 1; i <= 5; i++) {
      const y = padding + chartHeight - (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw line chart
    ctx.beginPath()
    ctx.strokeStyle = "#818cf8"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    lastEntries.forEach((entry, index) => {
      const x = padding + index * pointSpacing
      const y = padding + chartHeight - (entry.mood / 5) * chartHeight
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points
    lastEntries.forEach((entry, index) => {
      const x = padding + index * pointSpacing
      const y = padding + chartHeight - (entry.mood / 5) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = moodLabels[entry.mood]?.color || "#818cf8"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [entries])

  useEffect(() => {
    drawChart()
    window.addEventListener("resize", drawChart)
    return () => window.removeEventListener("resize", drawChart)
  }, [drawChart])

  const saveMood = () => {
    if (selectedMood === null) return

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note,
      timestamp: Date.now(),
    }

    const updated = [...entries, newEntry]
    setEntries(updated)
    localStorage.setItem("serenity-moods", JSON.stringify(updated))
    setSelectedMood(null)
    setNote("")
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Mood Tracker</h2>
        <p className="text-muted-foreground mt-2">How are you feeling today?</p>
      </div>

      <div className="bg-card rounded-xl p-6 space-y-4">
        <div className="flex justify-center gap-2 flex-wrap">
          {[5, 4, 3, 2, 1].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                selectedMood === mood
                  ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: moodLabels[mood].color + "33" }}
            >
              <span className="text-3xl">{moodLabels[mood].emoji}</span>
              <span className="text-xs mt-1 text-foreground">{moodLabels[mood].label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about your day (optional)..."
          className="w-full p-3 bg-muted rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none text-foreground placeholder:text-muted-foreground"
          rows={3}
        />

        <button
          onClick={saveMood}
          disabled={selectedMood === null}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Mood
        </button>
      </div>

      <div className="bg-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Your Mood History</h3>
        <canvas ref={canvasRef} className="w-full" />

        {entries.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...entries].reverse().slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <span className="text-2xl">{moodLabels[entry.mood]?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{moodLabels[entry.mood]?.label}</p>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground truncate">{entry.note}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
