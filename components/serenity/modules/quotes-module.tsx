"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

const quotes = [
  {
    text: "The greatest weapon against stress is our ability to choose one thought over another.",
    author: "William James",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.",
    author: "Oprah Winfrey",
  },
  {
    text: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
  },
  {
    text: "Your calm mind is the ultimate weapon against your challenges.",
    author: "Bryant McGill",
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  {
    text: "Peace is not the absence of conflict, but the ability to cope with it.",
    author: "Mahatma Gandhi",
  },
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
  },
  {
    text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Wellness is the complete integration of body, mind, and spirit.",
    author: "Greg Anderson",
  },
  {
    text: "Self-care is not self-indulgence, it is self-preservation.",
    author: "Audre Lorde",
  },
]

export function QuotesModule() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  const getNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      let newQuote = quotes[Math.floor(Math.random() * quotes.length)]
      while (newQuote.text === currentQuote.text) {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)]
      }
      setCurrentQuote(newQuote)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">Daily Inspiration</h2>
        <p className="text-muted-foreground mt-2">Words of wisdom for your wellness journey</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 md:p-12 border border-indigo-500/20">
          <svg
            className="absolute top-4 left-4 w-8 h-8 text-indigo-500/30"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <div
            className={`transition-all duration-300 ${
              isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
            }`}
          >
            <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed text-center mb-6">
              &ldquo;{currentQuote.text}&rdquo;
            </p>
            <p className="text-muted-foreground text-center font-medium">
              — {currentQuote.author}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={getNewQuote}
            disabled={isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`} />
            <span>New Quote</span>
          </button>
        </div>
      </div>
    </section>
  )
}
