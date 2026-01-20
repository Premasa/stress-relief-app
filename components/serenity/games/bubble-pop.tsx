"use client"

import React from "react"

import { useEffect, useRef, useState, useCallback } from "react"

interface Bubble {
  id: number
  x: number
  y: number
  radius: number
  color: string
  speed: number
  popping: boolean
  popProgress: number
}

const colors = ["#818cf8", "#c084fc", "#f472b6", "#38bdf8", "#34d399", "#fbbf24"]

export function BubblePopGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const bubblesRef = useRef<Bubble[]>([])
  const animationRef = useRef<number>(0)
  const nextIdRef = useRef(0)
  const lastSpawnRef = useRef(0)

  const createBubble = useCallback((canvasWidth: number, canvasHeight: number): Bubble => {
    const radius = 20 + Math.random() * 30
    return {
      id: nextIdRef.current++,
      x: radius + Math.random() * (canvasWidth - radius * 2),
      y: canvasHeight + radius,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1 + Math.random() * 2,
      popping: false,
      popProgress: 0,
    }
  }, [])

  const resetGame = useCallback(() => {
    setScore(0)
    bubblesRef.current = []
    nextIdRef.current = 0
    lastSpawnRef.current = 0
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 450
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new bubbles
      if (timestamp - lastSpawnRef.current > 800 && bubblesRef.current.length < 15) {
        bubblesRef.current.push(createBubble(canvas.width, canvas.height))
        lastSpawnRef.current = timestamp
      }

      // Update and draw bubbles
      bubblesRef.current = bubblesRef.current.filter((bubble) => {
        if (bubble.popping) {
          bubble.popProgress += 0.1
          if (bubble.popProgress >= 1) return false

          // Pop animation
          ctx.beginPath()
          ctx.arc(bubble.x, bubble.y, bubble.radius * (1 + bubble.popProgress * 0.5), 0, Math.PI * 2)
          ctx.fillStyle = bubble.color + Math.floor((1 - bubble.popProgress) * 255).toString(16).padStart(2, "0")
          ctx.fill()

          // Particles
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2
            const distance = bubble.radius * bubble.popProgress * 2
            ctx.beginPath()
            ctx.arc(
              bubble.x + Math.cos(angle) * distance,
              bubble.y + Math.sin(angle) * distance,
              3 * (1 - bubble.popProgress),
              0,
              Math.PI * 2
            )
            ctx.fillStyle = bubble.color
            ctx.fill()
          }
          return true
        }

        bubble.y -= bubble.speed

        // Remove if off screen
        if (bubble.y < -bubble.radius) return false

        // Draw bubble
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x,
          bubble.y,
          bubble.radius
        )
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(0.5, bubble.color + "cc")
        gradient.addColorStop(1, bubble.color)
        ctx.fillStyle = gradient
        ctx.fill()

        // Shine
        ctx.beginPath()
        ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
        ctx.fill()

        return true
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [createBubble])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    bubblesRef.current.forEach((bubble) => {
      if (bubble.popping) return
      const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2)
      if (distance < bubble.radius) {
        bubble.popping = true
        setScore((prev) => prev + Math.floor(50 - bubble.radius))
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-foreground">
          Score: <strong className="text-indigo-500">{score}</strong>
        </span>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          Reset
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full rounded-lg bg-gradient-to-b from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 cursor-pointer"
      />
    </div>
  )
}
