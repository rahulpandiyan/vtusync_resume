"use client"
import { useRef, useState, useEffect } from "react"
import { Play, Maximize2 } from "lucide-react"
import { withBasePath } from "@/lib/utils"

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleVideoEnd = () => {
      setIsPlaying(false)
    }
    
    const video = videoRef.current
    if (video) {
      video.addEventListener('ended', handleVideoEnd)
    }
    
    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [])

  return (
    <section className="py-24 md:py-32 px-4 relative bg-white dark:bg-zinc-950 scroll-mt-20" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 relative z-10">
          <div className="flex justify-center mb-8">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
              Product Demo
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
            ResuSync in action
          </h2>
          
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Watch how our AI-powered platform transforms your career in minutes.
          </p>
        </div>
        
        {/* Video container with sleek minimalist style */}
        <div className="relative mx-auto group max-w-5xl">
          <div className="relative aspect-video w-full overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.01] z-10">
            <div 
              className="relative h-full w-full overflow-hidden cursor-pointer bg-black" 
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={withBasePath("/ResuSync.mp4")}
                poster={withBasePath("/thumbnail.png")}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Play button overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors hover:bg-black/30">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                </div>
              )}
              
              {/* Controls overlay */}
              <div className="absolute bottom-6 right-6 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Feature badges below video */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {["Real-time AI", "ATS Optimized", "Instant Transformation"].map((badge, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 