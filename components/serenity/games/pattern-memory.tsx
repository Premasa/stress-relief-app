"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const COLORS = [
  { id: 0, bg: "bg-rose-500", glow: "shadow-rose-500/50" },
  { id: 1, bg: "bg-emerald-500", glow: "shadow-emerald-500/50" },
  { id: 2, bg: "bg-amber-500", glow: "shadow-amber-500/50" },
  { id: 3, bg: "bg-sky-500", glow: "shadow-sky-500/50" },
]

export function PatternMemoryGame() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [gameState, setGameState] = useState<"idle" | "watching" | "playing" | "success" | "fail">("idle")
  const [level, setLevel] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const audioContext = useRef<AudioContext | null>(null)

  const playTone = useCallback((frequency: number, duration: number = 200) => {
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
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration / 1000)
  }, [])

  const colorFrequencies = [261.63, 329.63, 392.00, 523.25]

  const flashColor = useCallback(async (colorId: number) => {
    setActiveColor(colorId)
    playTone(colorFrequencies[colorId])
    await new Promise(resolve => setTimeout(resolve, 400))
    setActiveColor(null)
    await new Promise(resolve => setTimeout(resolve, 200))
  }, [playTone, colorFrequencies])

  const showSequence = useCallback(async () => {
    setIsShowingSequence(true)
    setGameState("watching")
    await new Promise(resolve => setTimeout(resolve, 500))
    
    for (const colorId of sequence) {
      await flashColor(colorId)
    }
    
    setIsShowingSequence(false)
    setGameState("playing")
  }, [sequence, flashColor])

  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4)
    setSequence(prev => [...prev, newColor])
  }, [])

  const startGame = useCallback(() => {
    setSequence([Math.floor(Math.random() * 4)])
    setPlayerSequence([])
    setLevel(1)
    setIsPlaying(true)
    setGameState("idle")
  }, [])

  useEffect(() => {
    if (isPlaying && sequence.length > 0 && gameState === "idle") {
      const timer = setTimeout(() => {
        showSequence()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, sequence, gameState, showSequence])

  const handleColorClick = useCallback((colorId: number) => {
    if (gameState !== "playing" || isShowingSequence) return

    playTone(colorFrequencies[colorId])
    setActiveColor(colorId)
    setTimeout(() => setActiveColor(null), 200)

    const newPlayerSequence = [...playerSequence, colorId]
    setPlayerSequence(newPlayerSequence)

    const currentIndex = newPlayerSequence.length - 1
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      setGameState("fail")
      setIsPlaying(false)
      if (level > highScore) {
        setHighScore(level)
      }
      return
    }

    if (newPlayerSequence.length === sequence.length) {
      setGameState("success")
      setLevel(prev => prev + 1)
      
      setTimeout(() => {
        setPlayerSequence([])
        addToSequence()
        setGameState("idle")
      }, 1000)
    }
  }, [gameState, isShowingSequence, playerSequence, sequence, level, highScore, addToSequence, playTone, colorFrequencies])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="flex items-center justify-between w-full max-w-sm mb-8">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Level</p>
          <p className="text-3xl font-bold text-foreground">{level}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Best</p>
          <p className="text-3xl font-bold text-primary">{highScore}</p>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 h-8 flex items-center">
        {gameState === "watching" && (
          <p className="text-muted-foreground animate-pulse">Watch the pattern...</p>
        )}
        {gameState === "playing" && (
          <p className="text-foreground font-medium">Your turn! ({playerSequence.length}/{sequence.length})</p>
        )}
        {gameState === "success" && (
          <p className="text-green-500 font-medium animate-in fade-in">Great job! Next level...</p>
        )}
        {gameState === "fail" && (
          <p className="text-red-500 font-medium animate-in fade-in">Game Over!</p>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            disabled={gameState !== "playing"}
            className={`w-28 h-28 rounded-2xl transition-all duration-150 ${color.bg} ${
              activeColor === color.id 
                ? `brightness-150 scale-105 shadow-lg ${color.glow}` 
                : "brightness-75 hover:brightness-90"
            } ${gameState !== "playing" ? "cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
          />
        ))}
      </div>

      {/* Controls */}
      {!isPlaying ? (
        <Button onClick={startGame} size="lg" className="gap-2 px-8">
          <Play className="w-5 h-5" />
          {gameState === "fail" ? "Play Again" : "Start Game"}
        </Button>
      ) : (
        <Button onClick={startGame} variant="outline" size="lg" className="gap-2 bg-transparent">
          <RotateCcw className="w-5 h-5" />
          Restart
        </Button>
      )}

      <p className="text-xs text-muted-foreground mt-6 text-center max-w-xs">
        Watch the pattern light up, then repeat it by clicking the colors in the same order
      </p>
    </div>
  )
}
