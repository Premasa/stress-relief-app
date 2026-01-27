"use client"

import { useState, useEffect, useCallback } from "react"

interface Card {
  id: number
  color: string
  isFlipped: boolean
  isMatched: boolean
}

const cardColors = ["#818cf8", "#c084fc", "#f472b6", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa"]

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function ColorMatchGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  const initGame = useCallback(() => {
    const colors = cardColors.slice(0, 8)
    const pairs = [...colors, ...colors]
    const shuffled = shuffleArray(pairs)
    const newCards: Card[] = shuffled.map((color, index) => ({
      id: index,
      color,
      isFlipped: false,
      isMatched: false,
    }))
    setCards(newCards)
    setFlippedCards([])
    setScore(0)
    setIsLocked(false)
  }, [])

  useEffect(() => {
    initGame()
  }, [initGame])

  const handleCardClick = (id: number) => {
    if (isLocked) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlipped = [...flippedCards, id]
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)))
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setIsLocked(true)
      const [first, second] = newFlipped
      const firstCard = cards.find((c) => c.id === first)
      const secondCard = cards.find((c) => c.id === second)

      if (firstCard && secondCard && firstCard.color === secondCard.color) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, isMatched: true } : c))
          )
          setScore((prev) => prev + 1)
          setFlippedCards([])
          setIsLocked(false)
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, isFlipped: false } : c))
          )
          setFlippedCards([])
          setIsLocked(false)
        }, 1000)
      }
    }
  }

  const allMatched = cards.every((c) => c.isMatched)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-foreground">
          Matches: <strong className="text-indigo-500">{score}/8</strong>
        </span>
        <button
          onClick={initGame}
          className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          New Game
        </button>
      </div>

      {allMatched && (
        <div className="text-center py-4">
          <p className="text-2xl font-bold text-indigo-500">Congratulations! You matched all cards!</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || card.isFlipped || isLocked}
            className={`aspect-square rounded-xl transition-all duration-300 transform ${
              card.isFlipped || card.isMatched
                ? "rotate-y-0"
                : "bg-gradient-to-br from-indigo-500 to-purple-500 hover:scale-105"
            } ${card.isMatched ? "opacity-50 scale-95" : ""}`}
            style={{
              backgroundColor: card.isFlipped || card.isMatched ? card.color : undefined,
              transformStyle: "preserve-3d",
            }}
          >
            {!card.isFlipped && !card.isMatched && (
              <span className="text-white text-2xl">?</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
