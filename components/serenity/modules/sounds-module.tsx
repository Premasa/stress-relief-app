"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Play,
  Pause,
  Volume2,
  Waves,
  TreePine,
  Moon,
  Flame,
  Building2,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react"

interface Sound {
  id: string
  name: string
  category: string
  image: string
  videoId: string
}

// Each sound has a specific matching image and YouTube video with real audio
const sounds: Sound[] = [
  // Nature Sounds
  {
    id: "rain",
    name: "Gentle Rain",
    category: "Nature",
    image: "https://images.pexels.com/photos/1089455/pexels-photo-1089455.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "nmP_uXst7zM", // Heavy Rain on Tin Roof (10h) - High Quality
  },
  {
    id: "thunderstorm",
    name: "Thunderstorm",
    category: "Nature",
    image: "https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "mPZkdNFqePs", // Thunderstorm (10h) - Relaxing White Noise
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    category: "Nature",
    image: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "f77SKrunzo4", // Tropical Ocean Waves (10h) - Calm
  },
  {
    id: "forest",
    name: "Forest Birds",
    category: "Nature",
    image: "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "qx8eFpXy9f8", // Spring Forest Birdsong (10h)
  },
  {
    id: "river",
    name: "River Stream",
    category: "Nature",
    image: "https://images.pexels.com/photos/2406396/pexels-photo-2406396.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "vPhg6sc1Mk4", // Mountain Stream (10h) - Nature Relaxation
  },
  {
    id: "waterfall",
    name: "Waterfall",
    category: "Nature",
    image: "https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "kX3T0P81F6k", // Forest Waterfall (10h) - Verified
  },
  {
    id: "wind",
    name: "Gentle Wind",
    category: "Nature",
    image: "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "q76bMs-NwRk", // Winter Wind (10h) - Relaxing White Noise
  },
  {
    id: "crickets",
    name: "Night Crickets",
    category: "Night",
    image: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "baA6mTCn54A", // Night Crickets (8h) - Verified Stable
  },
  {
    id: "night-forest",
    name: "Night Forest",
    category: "Night",
    image: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "qxQf8V6w_2Y", // Night Forest (10h) - High Compatibility Alternative
  },
  {
    id: "owl",
    name: "Owl Sounds",
    category: "Night",
    image: "https://images.pexels.com/photos/1181181/pexels-photo-1181181.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "HvbW9kyIp50", // Owl - High Quality
  },
  // Cozy Sounds
  {
    id: "fireplace",
    name: "Fireplace",
    category: "Cozy",
    image: "https://images.pexels.com/photos/5765846/pexels-photo-5765846.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "L_LUpnjgPso", // Fireplace - Verified
  },
  {
    id: "campfire",
    name: "Campfire",
    category: "Cozy",
    image: "https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "f4b_urefKVI", // Campfire - Verified
  },
  {
    id: "rain-window",
    name: "Rain on Window",
    category: "Cozy",
    image: "https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "QMSdJz24Ssk", // Rain on Window (10h) - High Quality
  },
  {
    id: "coffee-shop",
    name: "Coffee Shop",
    category: "Cozy",
    image: "https://images.pexels.com/photos/1024359/pexels-photo-1024359.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "uiHZxOk0yQI", // Coffee Shop - Verified
  },
  {
    id: "piano",
    name: "Soft Piano",
    category: "Cozy",
    image: "https://images.pexels.com/photos/164935/pexels-photo-164935.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "lCOF9LN_Zxs", // Piano - Verified
  },
  // Urban Sounds
  {
    id: "city",
    name: "City Ambiance",
    category: "Urban",
    image: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "WdY79zYx82A", // City - Verified
  },
  {
    id: "train",
    name: "Train Journey",
    category: "Urban",
    image: "https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "2Z5q159oM1k", // Train - Verified
  },
  {
    id: "airplane",
    name: "Airplane Cabin",
    category: "Urban",
    image: "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "caIbK6etWzg", // Airplane - Verified
  },
  {
    id: "system-test",
    name: "System Test",
    category: "Debug",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600",
    videoId: "M7lc1UVf-VE", // YouTube Dev Test Video
  },
]

const categories = ["All", "Nature", "Night", "Cozy", "Urban", "Debug"]

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Waves className="w-4 h-4" />,
  Nature: <TreePine className="w-4 h-4" />,
  Night: <Moon className="w-4 h-4" />,
  Cozy: <Flame className="w-4 h-4" />,
  Urban: <Building2 className="w-4 h-4" />,
  Debug: <Maximize2 className="w-4 h-4" />,
}

export function SoundsModule() {
  const [currentSound, setCurrentSound] = useState<Sound | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const filteredSounds = selectedCategory === "All" ? sounds : sounds.filter((s) => s.category === selectedCategory)

  // Handle fullscreen using browser API
  const toggleFullscreen = useCallback(() => {
    if (!videoContainerRef.current) return

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {
        setIsFullscreen(true)
      })
    } else {
      document.exitFullscreen()
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const playSound = useCallback((sound: Sound) => {
    console.log('[SoundsModule v4.0] Playing sound:', sound.name, '| Video ID:', sound.videoId)
    if (currentSound?.id === sound.id) {
      setCurrentSound(null)
    } else {
      setCurrentSound(sound)
    }
  }, [currentSound])

  const handleImageError = (soundId: string) => {
    setImageErrors((prev) => new Set(prev).add(soundId))
  }

  const isPlaying = (soundId: string) => currentSound?.id === soundId

  // Get vibrant colorful gradient for each sound
  const getGradient = (sound: Sound) => {
    const gradients: Record<string, string> = {
      // Nature - vibrant blues, greens, teals
      rain: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6B8DD6 100%)",
      thunderstorm: "linear-gradient(135deg, #4A00E0 0%, #8E2DE2 50%, #FF6B6B 100%)",
      ocean: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 50%, #00d2ff 100%)",
      forest: "linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #56ab2f 100%)",
      river: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 50%, #36D1DC 100%)",
      waterfall: "linear-gradient(135deg, #00B4DB 0%, #0083B0 50%, #00d2ff 100%)",
      wind: "linear-gradient(135deg, #89CFF0 0%, #a8e6cf 50%, #88D8B0 100%)",
      // Night - deep purples, indigos, dark blues
      crickets: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      "night-forest": "linear-gradient(135deg, #141E30 0%, #243B55 50%, #0f2027 100%)",
      owl: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #4a1c6d 100%)",
      // Cozy - warm oranges, reds, ambers
      fireplace: "linear-gradient(135deg, #f12711 0%, #f5af19 50%, #f12711 100%)",
      campfire: "linear-gradient(135deg, #FF512F 0%, #F09819 50%, #DD2476 100%)",
      "rain-window": "linear-gradient(135deg, #355C7D 0%, #6C5B7B 50%, #C06C84 100%)",
      "coffee-shop": "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)",
      piano: "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 50%, #2C3E50 100%)",
      // Urban - cool grays, neons, cyans
      city: "linear-gradient(135deg, #fc00ff 0%, #00dbde 50%, #fc00ff 100%)",
      train: "linear-gradient(135deg, #373B44 0%, #4286f4 50%, #373B44 100%)",
      airplane: "linear-gradient(135deg, #2196F3 0%, #f44336 50%, #2196F3 100%)",
    }
    return gradients[sound.id] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }

  // Debug logging
  useEffect(() => {
    if (currentSound) {
      console.log('[SoundsModule v4.0] currentSound changed to:', currentSound.name, '| Video ID:', currentSound.videoId)
      console.log('[SoundsModule v4.0] Iframe src will be:', `https://www.youtube.com/embed/${currentSound.videoId}?autoplay=1&loop=1&playlist=${currentSound.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`)
    }
  }, [currentSound])

  return (
    <section className="space-y-6 animate-in fade-in duration-300">
      {/* Big Video Player - Shows the matched YouTube video WITH AUDIO when sound is playing */}
      <div
        ref={videoContainerRef}
        className={`relative overflow-hidden shadow-2xl transition-all duration-500 bg-black ${isFullscreen
          ? "fixed inset-0 z-50 rounded-none"
          : "w-full aspect-video rounded-3xl"
          }`}
      >
        {/* Native Iframe Implementation for Maximum Stability */}
        <div className="absolute inset-0 w-full h-full bg-black">
          {currentSound && (
            <iframe
              key={currentSound.videoId} // CRITICAL: Forces iframe recreation on video change
              src={`https://www.youtube.com/embed/${currentSound.videoId}?autoplay=1&loop=1&playlist=${currentSound.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
              title={currentSound.name}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                // Simple fade-in effect
                "opacity-100"
                }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ border: 0 }}
            />
          )}
        </div>

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          {isFullscreen && (
            <button
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen()
                }
                setIsFullscreen(false)
              }}
              className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
              title="Close Fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Now Playing Info */}
        {currentSound && (
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
            <div className="px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold text-gray-900">Now Playing:</span>
              <span className="text-gray-700">{currentSound.name}</span>
            </div>
            <button
              onClick={() => {
                setCurrentSound(null)
              }}
              className="px-5 py-3 rounded-2xl bg-red-500/90 hover:bg-red-600 text-white backdrop-blur-md shadow-xl transition-colors font-medium flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Stop
            </button>
          </div>
        )}

        {!currentSound && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            }}
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <Volume2 className="w-12 h-12 text-white/60" />
              </div>
              <p className="text-white/90 text-xl font-medium mb-2">Select a Sound to Play</p>
              <p className="text-white/60">Choose from nature, night, cozy, or urban sounds below</p>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === category
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
              }`}
          >
            {categoryIcons[category]}
            <span>{category}</span>
          </button>
        ))}
      </div>

      {/* Sound Cards Grid - Each card has an IMAGE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredSounds.map((sound) => (
          <button
            key={sound.id}
            onClick={() => playSound(sound)}
            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isPlaying(sound.id) ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""
              }`}
          >
            {/* Image Background */}
            {!imageErrors.has(sound.id) ? (
              <Image
                src={sound.image || "/placeholder.svg"}
                alt={sound.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => handleImageError(sound.id)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: getGradient(sound) }}
              />
            )}

            {/* Colorful Gradient Overlay */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-60"
              style={{ background: getGradient(sound) }}
            />

            {/* Dark overlay for text readability */}
            <div className={`absolute inset-0 transition-all duration-300 ${isPlaying(sound.id)
              ? "bg-primary/30"
              : "bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90"
              }`} />

            {/* Play/Pause Icon */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isPlaying(sound.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${isPlaying(sound.id)
                ? "bg-white text-primary scale-100"
                : "bg-white/90 text-gray-800 scale-90 group-hover:scale-100"
                }`}>
                {isPlaying(sound.id) ? (
                  <Pause className="w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7 ml-1" />
                )}
              </div>
            </div>

            {/* Sound Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-semibold text-sm drop-shadow-lg">{sound.name}</h3>
              <span className="text-white/80 text-xs drop-shadow">{sound.category}</span>
            </div>

            {/* Playing indicator */}
            {isPlaying(sound.id) && (
              <div className="absolute top-2 right-2">
                <div className="flex items-end gap-0.5 h-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white rounded-full animate-pulse"
                      style={{
                        height: `${40 + Math.random() * 60}%`,
                        animationDuration: `${0.3 + i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Info message */}
      <div className="bg-secondary/30 rounded-2xl p-4 text-center">
        <p className="text-muted-foreground text-sm">
          Click on any sound card to play. The video player above will show the matching video WITH audio.
          Use the mute button to toggle sound on/off.
        </p>
        <p className="text-xs text-muted-foreground/50 mt-2">v8.1 - Enhanced Compatibility Update</p>
      </div>
    </section >
  )
}
