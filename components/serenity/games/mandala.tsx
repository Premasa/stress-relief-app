"use client"

import React from "react"

import { useRef, useState, useEffect, useCallback } from "react"

export function MandalaGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#8b5cf6")
  const [symmetry, setSymmetry] = useState(8)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        const size = Math.min(container.clientWidth, 450)
        canvas.width = size
        canvas.height = size
        ctx.fillStyle = "#1a1a2e"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw center guide
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(139, 92, 246, 0.2)"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e)
    if (coords) {
      setIsDrawing(true)
      lastPosRef.current = coords
    }
  }

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      const coords = getCoordinates(e)
      if (!coords || !lastPosRef.current) return

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const angle = (Math.PI * 2) / symmetry

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      for (let i = 0; i < symmetry; i++) {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle * i)

        // Draw normal
        ctx.beginPath()
        ctx.moveTo(lastPosRef.current.x - centerX, lastPosRef.current.y - centerY)
        ctx.lineTo(coords.x - centerX, coords.y - centerY)
        ctx.stroke()

        // Draw mirrored
        ctx.scale(1, -1)
        ctx.beginPath()
        ctx.moveTo(lastPosRef.current.x - centerX, lastPosRef.current.y - centerY)
        ctx.lineTo(coords.x - centerX, coords.y - centerY)
        ctx.stroke()

        ctx.restore()
      }

      lastPosRef.current = coords
    },
    [isDrawing, color, symmetry]
  )

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPosRef.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Redraw center guide
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(139, 92, 246, 0.2)"
    ctx.lineWidth = 1
    ctx.stroke()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-foreground">Symmetry:</label>
          <select
            value={symmetry}
            onChange={(e) => setSymmetry(Number(e.target.value))}
            className="px-3 py-2 bg-muted rounded-lg text-foreground border-0 outline-none"
          >
            <option value="6">6 Sides</option>
            <option value="8">8 Sides</option>
            <option value="12">12 Sides</option>
          </select>
        </div>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors ml-auto"
        >
          Clear
        </button>
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="rounded-full cursor-crosshair touch-none shadow-lg"
        />
      </div>
    </div>
  )
}
