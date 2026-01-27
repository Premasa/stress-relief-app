"use client"

import React from "react"

import { useRef, useEffect, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
}

const colors = ["#818cf8", "#c084fc", "#f472b6", "#38bdf8", "#34d399"]

export function ParticleFlowGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animationRef = useRef<number>(0)

  const createParticle = useCallback((x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2
    const speed = 0.5 + Math.random() * 1.5
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
    }
  }, [])

  const resetParticles = useCallback(() => {
    particlesRef.current = []
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

    // Initialize with some particles
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push(
        createParticle(Math.random() * canvas.width, Math.random() * canvas.height)
      )
    }

    const animate = () => {
      if (!ctx || !canvas) return

      // Fade effect
      ctx.fillStyle = "rgba(15, 15, 35, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn particles at mouse position
      if (mouseRef.current.active && particlesRef.current.length < 500) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(createParticle(mouseRef.current.x, mouseRef.current.y))
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Attract to mouse
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance > 50) {
            particle.vx += (dx / distance) * 0.05
            particle.vy += (dy / distance) * 0.05
          }
        }

        // Add some randomness
        particle.vx += (Math.random() - 0.5) * 0.1
        particle.vy += (Math.random() - 0.5) * 0.1

        // Limit velocity
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
        if (speed > 3) {
          particle.vx = (particle.vx / speed) * 3
          particle.vy = (particle.vy / speed) * 3
        }

        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.002

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        if (particle.life <= 0) return false

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(particle.life * 255).toString(16).padStart(2, "0")
        ctx.fill()

        // Draw connections to nearby particles
        particlesRef.current.forEach((other) => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 50 && dist > 0) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = particle.color + Math.floor((1 - dist / 50) * 50).toString(16).padStart(2, "0")
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })

        return true
      })

      // Maintain minimum particles
      while (particlesRef.current.length < 50) {
        particlesRef.current.push(
          createParticle(Math.random() * canvas.width, Math.random() * canvas.height)
        )
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initial fill
    ctx.fillStyle = "rgb(15, 15, 35)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [createParticle])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = e.clientX - rect.left
    mouseRef.current.y = e.clientY - rect.top
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = e.touches[0].clientX - rect.left
    mouseRef.current.y = e.touches[0].clientY - rect.top
    mouseRef.current.active = true
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground text-sm">Move your mouse to control the flow</span>
        <button
          onClick={resetParticles}
          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          Reset
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => (mouseRef.current.active = true)}
        onMouseLeave={() => (mouseRef.current.active = false)}
        onTouchStart={(e) => {
          handleTouchMove(e)
          mouseRef.current.active = true
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => (mouseRef.current.active = false)}
        className="w-full rounded-lg cursor-none touch-none"
      />
    </div>
  )
}
