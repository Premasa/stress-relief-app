"use client"

import React from "react"

import { useState } from "react"
import { Sparkles, Palette, Brush, CircleDot, Waves, Shuffle, Grid3X3, Wind, Timer } from "lucide-react"
import { BubblePopGame } from "@/components/serenity/games/bubble-pop"
import { ColorMatchGame } from "@/components/serenity/games/color-match"
import { ZenDrawGame } from "@/components/serenity/games/zen-draw"
import { MandalaGame } from "@/components/serenity/games/mandala"
import { ParticleFlowGame } from "@/components/serenity/games/particle-flow"
import { WordScrambleGame } from "@/components/serenity/games/word-scramble"
import { PatternMemoryGame } from "@/components/serenity/games/pattern-memory"
import { BreathingBallGame } from "@/components/serenity/games/breathing-ball"
import { FocusTimerGame } from "@/components/serenity/games/focus-timer"

type GameType = "bubbles" | "colors" | "draw" | "mandala" | "particles" | "words" | "pattern" | "breathing" | "focus"

const games: { id: GameType; name: string; icon: React.ReactNode; description: string }[] = [
  { id: "bubbles", name: "Bubble Pop", icon: <Sparkles className="w-5 h-5" />, description: "Pop floating bubbles" },
  { id: "colors", name: "Color Match", icon: <Palette className="w-5 h-5" />, description: "Find matching pairs" },
  { id: "draw", name: "Zen Draw", icon: <Brush className="w-5 h-5" />, description: "Free-form drawing" },
  { id: "mandala", name: "Mandala Art", icon: <CircleDot className="w-5 h-5" />, description: "Symmetrical patterns" },
  { id: "particles", name: "Particle Flow", icon: <Waves className="w-5 h-5" />, description: "Mesmerizing particles" },
  { id: "words", name: "Word Calm", icon: <Shuffle className="w-5 h-5" />, description: "Unscramble calming words" },
  { id: "pattern", name: "Pattern Memory", icon: <Grid3X3 className="w-5 h-5" />, description: "Remember the sequence" },
  { id: "breathing", name: "Breath Guide", icon: <Wind className="w-5 h-5" />, description: "Guided breathing" },
  { id: "focus", name: "Focus Timer", icon: <Timer className="w-5 h-5" />, description: "Pomodoro technique" },
]

export function GamesModule() {
  const [activeGame, setActiveGame] = useState<GameType>("bubbles")

  const currentGame = games.find(g => g.id === activeGame)

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Mindful Activities</h2>
        <p className="text-muted-foreground mt-2">Take a mindful break with these relaxing activities</p>
      </div>

      {/* Game Selector Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
              activeGame === game.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {game.icon}
            <span className="text-xs font-medium text-center leading-tight">{game.name}</span>
          </button>
        ))}
      </div>

      {/* Current Game Info */}
      {currentGame && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{currentGame.description}</p>
        </div>
      )}

      {/* Game Container */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden min-h-[500px]">
        {activeGame === "bubbles" && <BubblePopGame />}
        {activeGame === "colors" && <ColorMatchGame />}
        {activeGame === "draw" && <ZenDrawGame />}
        {activeGame === "mandala" && <MandalaGame />}
        {activeGame === "particles" && <ParticleFlowGame />}
        {activeGame === "words" && <WordScrambleGame />}
        {activeGame === "pattern" && <PatternMemoryGame />}
        {activeGame === "breathing" && <BreathingBallGame />}
        {activeGame === "focus" && <FocusTimerGame />}
      </div>
    </section>
  )
}
