"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Shuffle, Check, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const calmWords = [
  { word: "PEACE", hint: "A state of tranquility" },
  { word: "SERENE", hint: "Calm and peaceful" },
  { word: "BREATHE", hint: "Inhale and exhale" },
  { word: "RELAX", hint: "Let go of tension" },
  { word: "GENTLE", hint: "Soft and kind" },
  { word: "MINDFUL", hint: "Being present" },
  { word: "CALM", hint: "Not excited or anxious" },
  { word: "HARMONY", hint: "Balance and agreement" },
  { word: "WELLNESS", hint: "State of good health" },
  { word: "BALANCE", hint: "Equal distribution" },
  { word: "RESTORE", hint: "Bring back to original" },
  { word: "SOOTHE", hint: "Gently calm" },
  { word: "TRANQUIL", hint: "Free from disturbance" },
  { word: "HEALING", hint: "Process of recovery" },
  { word: "NATURE", hint: "The natural world" },
]

export function WordScrambleGame() {
  const [currentWord, setCurrentWord] = useState(calmWords[0])
  const [scrambled, setScrambled] = useState("")
  const [userGuess, setUserGuess] = useState("")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())

  const scrambleWord = useCallback((word: string) => {
    const arr = word.split("")
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    const scrambled = arr.join("")
    if (scrambled === word) return scrambleWord(word)
    return scrambled
  }, [])

  const getNewWord = useCallback(() => {
    const availableWords = calmWords.filter(w => !usedWords.has(w.word))
    if (availableWords.length === 0) {
      setUsedWords(new Set())
      const randomWord = calmWords[Math.floor(Math.random() * calmWords.length)]
      return randomWord
    }
    return availableWords[Math.floor(Math.random() * availableWords.length)]
  }, [usedWords])

  const startNewRound = useCallback(() => {
    const newWord = getNewWord()
    setCurrentWord(newWord)
    setScrambled(scrambleWord(newWord.word))
    setUserGuess("")
    setShowHint(false)
    setIsCorrect(null)
    setUsedWords(prev => new Set([...prev, newWord.word]))
  }, [getNewWord, scrambleWord])

  useEffect(() => {
    startNewRound()
  }, [])

  const checkAnswer = () => {
    const correct = userGuess.toUpperCase().trim() === currentWord.word
    setIsCorrect(correct)
    
    if (correct) {
      const points = showHint ? 5 : 10
      setScore(prev => prev + points + streak * 2)
      setStreak(prev => prev + 1)
      setTimeout(() => {
        startNewRound()
      }, 1500)
    } else {
      setStreak(0)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userGuess.length > 0) {
      checkAnswer()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="flex items-center justify-between w-full max-w-md mb-8">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Score</p>
          <p className="text-2xl font-bold text-foreground">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Streak</p>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-2xl font-bold text-amber-500">{streak}</p>
          </div>
        </div>
      </div>

      <div className={`p-8 rounded-3xl mb-6 transition-all ${
        isCorrect === true ? "bg-green-500/20" : 
        isCorrect === false ? "bg-red-500/20" : 
        "bg-gradient-to-br from-primary/10 to-primary/5"
      }`}>
        <div className="flex gap-2 justify-center flex-wrap">
          {scrambled.split("").map((letter, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl bg-card border-2 border-primary/30 flex items-center justify-center text-xl font-bold text-foreground shadow-sm"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>

      {showHint && (
        <p className="text-muted-foreground text-sm mb-4 italic">Hint: {currentWord.hint}</p>
      )}

      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
          onKeyDown={handleKeyPress}
          placeholder="Type your answer..."
          className="w-full px-6 py-4 text-center text-xl font-medium rounded-2xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          maxLength={currentWord.word.length}
        />

        <div className="flex gap-3">
          <Button
            onClick={() => setShowHint(true)}
            disabled={showHint}
            variant="outline"
            className="flex-1"
          >
            Show Hint
          </Button>
          <Button
            onClick={checkAnswer}
            disabled={userGuess.length === 0}
            className="flex-1 gap-2"
          >
            <Check className="w-4 h-4" />
            Check
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setScrambled(scrambleWord(currentWord.word))}
            variant="ghost"
            className="flex-1 gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Reshuffle
          </Button>
          <Button
            onClick={startNewRound}
            variant="ghost"
            className="flex-1 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Skip Word
          </Button>
        </div>
      </div>

      {isCorrect === true && (
        <div className="mt-6 text-green-500 font-medium animate-in fade-in zoom-in">
          Correct! +{showHint ? 5 : 10} points
        </div>
      )}
      {isCorrect === false && (
        <div className="mt-6 text-red-500 font-medium animate-in fade-in">
          Try again!
        </div>
      )}
    </div>
  )
}
