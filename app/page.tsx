"use client"

import { useState, useEffect } from "react"
import { WelcomeModal } from "@/components/serenity/welcome-modal"
import { Header } from "@/components/serenity/header"
import { Navigation } from "@/components/serenity/navigation"
import { HomeModule } from "@/components/serenity/modules/home-module"
import { BreathingModule } from "@/components/serenity/modules/breathing-module"
import { SoundsModule } from "@/components/serenity/modules/sounds-module"
import { GamesModule } from "@/components/serenity/modules/games-module"
import { MoodModule } from "@/components/serenity/modules/mood-module"
import { QuotesModule } from "@/components/serenity/modules/quotes-module"
import { RemindersModule } from "@/components/serenity/modules/reminders-module"
import { ThemeToggle } from "@/components/serenity/theme-toggle"

export type ModuleType = "home" | "breathing" | "sounds" | "games" | "mood" | "quotes" | "reminders"

export default function SerenityApp() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [userName, setUserName] = useState("")
  const [activeModule, setActiveModule] = useState<ModuleType>("home")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem("serenity-username")
    if (savedName) {
      setUserName(savedName)
      setShowWelcome(false)
    }

    const savedTheme = localStorage.getItem("serenity-theme")
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleStartJourney = (name: string) => {
    setUserName(name)
    localStorage.setItem("serenity-username", name)
    setShowWelcome(false)
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("serenity-theme", isDark ? "light" : "dark")
  }

  const handleQuickAction = (action: ModuleType) => {
    setActiveModule(action)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? "dark" : ""}`}>
      {/* Animated gradient background */}
      <div className="fixed inset-0 gradient-bg opacity-20 dark:opacity-10" />
      
      {/* Floating gradient orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen bg-background/80 backdrop-blur-sm">
        {showWelcome && <WelcomeModal onStart={handleStartJourney} />}
        
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        
        <div className="max-w-6xl mx-auto px-4 pb-24">
          <Header userName={userName} />
          
          <Navigation activeModule={activeModule} onModuleChange={setActiveModule} />
          
          <main className="mt-6">
            {activeModule === "home" && <HomeModule userName={userName} onQuickAction={handleQuickAction} />}
            {activeModule === "breathing" && <BreathingModule />}
            {activeModule === "sounds" && <SoundsModule />}
            {activeModule === "games" && <GamesModule />}
            {activeModule === "mood" && <MoodModule />}
            {activeModule === "quotes" && <QuotesModule />}
            {activeModule === "reminders" && <RemindersModule />}
          </main>
        </div>
      </div>
    </div>
  )
}
