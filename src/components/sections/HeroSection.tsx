"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Play, Users, Award, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useState, useEffect } from "react"

// Carousel Image Component with Loading State
const CarouselImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.onerror = () => {
      setImageError(true)
      setImageLoaded(true)
    }
    img.src = src
  }, [src])

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
        </div>
      )}
      {imageError ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      ) : (
        <img 
          src={src}
          alt={alt}
          className={className}
          style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(true)
          }}
        />
      )}
    </div>
  )
}

// Rubik's Cube Face Component
const CubeFace = ({ 
  image, 
  position, 
  isActive 
}: { 
  image: { src: string; title: string; subtitle: string; description: string }
  position: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom'
  isActive: boolean
}) => {
  // translateZ should be half the cube size (150px for mobile, 200px for desktop)
  // Using 175px as a middle ground that works reasonably for both
  const translateZ = 175
  
  const positions: Record<string, { rotateX?: number; rotateY?: number }> = {
    front: {},
    back: { rotateY: 180 },
    right: { rotateY: 90 },
    left: { rotateY: -90 },
    top: { rotateX: 90 },
    bottom: { rotateX: -90 },
  }
  
  const transform = positions[position]
  
  return (
    <div
      className="absolute w-full h-full"
      style={{
        transform: `
          rotateX(${transform.rotateX || 0}deg) 
          rotateY(${transform.rotateY || 0}deg) 
          translateZ(${translateZ}px)
        `,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Cube Face with Full Image */}
      <div className="relative w-full h-full bg-gray-800 border-2 border-gray-900 shadow-2xl overflow-hidden">
        {/* Full Image - consistent cover for all faces */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: isActive ? 'brightness(1.1)' : 'brightness(0.8)',
          }}
        />
        
        {/* Active face highlight */}
        {isActive && (
          <div className="absolute inset-0 border-2 border-white/50 pointer-events-none" />
        )}
        
        {/* Content overlay on active face */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {image.title}
            </h3>
            <p className="text-lg text-white/90 mb-1">
              {image.subtitle}
            </p>
            <p className="text-sm text-white/75">
              {image.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Animated Counter Hook
const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(start + (end - start) * easeOutQuart)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, start, isVisible])

  return { count, setIsVisible }
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [heroImages, setHeroImages] = useState<Array<{
    src: string
    title: string
    subtitle: string
    description: string
  }>>([])
  
  // Site Stats State
  const [siteStats, setSiteStats] = useState({
    studentsReached: 1500,
    schoolsVisited: 28,
    daysOfInnovation: 3
  })

  // Fetch hero carousel from API
  useEffect(() => {
    const fetchHeroCarousel = async () => {
      try {
        const response = await fetch("/api/content/carousels")
        const data = await response.json()
        if (data.success) {
          const heroSlides = data.data
            .filter((c: any) => c.type === "HERO" && c.active)
            .sort((a: any, b: any) => a.order - b.order)
            .map((c: any) => ({
              src: c.imageUrl,
              title: c.title,
              subtitle: c.subtitle || "",
              description: c.description || ""
            }))
          
          if (heroSlides.length > 0) {
            setHeroImages(heroSlides)
          }
        }
      } catch (error) {
        console.error("Error fetching hero carousel:", error)
      }
    }
    fetchHeroCarousel()
  }, [])

  // Fetch site stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/content/site-stats")
        const data = await response.json()
        if (data.success && data.data) {
          setSiteStats(data.data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  // Animated counters - reinitialize when stats change
  const studentsCount = useCountUp(siteStats.studentsReached, 2500)
  const schoolsCount = useCountUp(siteStats.schoolsVisited, 2000)
  const daysCount = useCountUp(siteStats.daysOfInnovation, 1500)

  // Trigger count animation when stats are loaded
  useEffect(() => {
    if (siteStats.studentsReached > 0) {
      studentsCount.setIsVisible(true)
      schoolsCount.setIsVisible(true)
      daysCount.setIsVisible(true)
    }
  }, [siteStats])

  const stats = [
    { icon: Users, value: `${siteStats.studentsReached}+`, label: "Students Reached" },
    { icon: Award, value: `${siteStats.schoolsVisited}`, label: "Schools Visited" },
    { icon: Calendar, value: `${siteStats.daysOfInnovation}`, label: "Days of Innovation" },
  ]

  // Auto-rotate slides
  useEffect(() => {
    if (heroImages.length === 0) return
    
    const interval = setInterval(() => {
      setIsTransitioning(true)
      const nextIndex = (currentSlide + 1) % heroImages.length
      setCurrentSlide(nextIndex)
      // Preload next image
      const img = new Image()
      img.src = heroImages[nextIndex].src
      img.onload = () => setIsTransitioning(false)
      img.onerror = () => setIsTransitioning(false)
      // Fallback timeout
      setTimeout(() => setIsTransitioning(false), 1000)
    }, 4000)
    return () => clearInterval(interval)
  }, [currentSlide, heroImages])

  const nextSlide = () => {
    if (heroImages.length === 0) return
    setIsTransitioning(true)
    const nextIndex = (currentSlide + 1) % heroImages.length
    setCurrentSlide(nextIndex)
    // Preload next image
    const img = new Image()
    img.src = heroImages[nextIndex].src
    img.onload = () => setIsTransitioning(false)
    img.onerror = () => setIsTransitioning(false)
    // Fallback timeout
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  const prevSlide = () => {
    if (heroImages.length === 0) return
    setIsTransitioning(true)
    const prevIndex = (currentSlide - 1 + heroImages.length) % heroImages.length
    setCurrentSlide(prevIndex)
    // Preload previous image
    const img = new Image()
    img.src = heroImages[prevIndex].src
    img.onload = () => setIsTransitioning(false)
    img.onerror = () => setIsTransitioning(false)
    // Fallback timeout
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOut cubic-bezier equivalent
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Floating Geometric Shapes */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
          style={{ animationDelay: "1s" }}
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Registration Badge with Confetti */}
            <motion.div
              variants={itemVariants}
              className="relative inline-block mb-6"
            >
              {/* Confetti Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Floating confetti pieces */}
                {[
                  { left: 15, top: 20 },
                  { left: 85, top: 15 },
                  { left: 25, top: 80 },
                  { left: 75, top: 70 },
                  { left: 45, top: 35 },
                  { left: 65, top: 85 },
                  { left: 35, top: 60 },
                  { left: 90, top: 40 },
                  { left: 10, top: 75 },
                  { left: 55, top: 25 },
                  { left: 80, top: 90 },
                  { left: 30, top: 45 }
                ].map((position, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-sm"
                    style={{
                      left: `${position.left}%`,
                      top: `${position.top}%`,
                    }}
                    animate={{
                      y: [-20, -40, -60],
                      x: [0, (i % 3 - 1) * 10],
                      rotate: [0, 180, 360],
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: [0.16, 1, 0.3, 1] as const
                    }}
                  />
                ))}
                
                {/* Sparkle effects */}
                {[
                  { left: 20, top: 30 },
                  { left: 70, top: 25 },
                  { left: 40, top: 80 },
                  { left: 85, top: 60 },
                  { left: 15, top: 70 },
                  { left: 60, top: 40 },
                  { left: 35, top: 15 },
                  { left: 90, top: 85 }
                ].map((position, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${position.left}%`,
                      top: `${position.top}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Main Badge */}
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-2 border border-white/20 cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
                }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.8)",
                    "0 0 0px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {/* Pulsing blue dot */}
                <motion.div 
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Text with subtle animation */}
                <motion.span 
                  className="text-sm font-medium"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255, 255, 255, 0)",
                      "0 0 10px rgba(255, 255, 255, 0.3)",
                      "0 0 0px rgba(255, 255, 255, 0)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  6th Edition - Registration Now Open
                </motion.span>
              </motion.div>

              {/* Celebration burst effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 rounded-full border border-blue-400/30" />
                <div className="absolute inset-1 rounded-full border border-blue-400/20" />
                <div className="absolute inset-2 rounded-full border border-blue-400/10" />
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              <span className="block">TIC Summit</span>
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl text-white mb-6 font-light"
            >
              Empowering Young Innovators
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-white mb-8 max-w-2xl leading-relaxed"
            >
              Cameroon's premier tech innovation program for Secondary and High school students. 
              Now in its 6th edition, TIC Summit continues to connect young minds with industry experts, 
              provide valuable mentorship, and celebrate innovative ideas.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="xl"
                className="bg-white hover:bg-white text-gray-900 group cursor-pointer"
              >
                <span>Apply Now</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="xl"
                className="group border-2 border-white bg-transparent text-white hover:bg-white hover:text-gray-900 cursor-pointer"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Watch Video</span>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
                onViewportEnter={() => studentsCount.setIsVisible(true)}
              >
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {studentsCount.count.toLocaleString()}+
                </div>
                <div className="text-sm text-white">
                  Students Reached
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center"
                onViewportEnter={() => schoolsCount.setIsVisible(true)}
              >
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {schoolsCount.count}
                </div>
                <div className="text-sm text-white">
                  Schools Visited
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="text-center"
                onViewportEnter={() => daysCount.setIsVisible(true)}
              >
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {daysCount.count}
                </div>
                <div className="text-sm text-white">
                  Days of Innovation
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - Rubik's Cube Carousel */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative h-[500px] flex items-center justify-center">
              {/* 3D Cube Container */}
              <div 
                className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
                style={{
                  perspective: '1200px',
                  perspectiveOrigin: '50% 50%'
                }}
              >
                {/* Loading Overlay */}
                {isTransitioning && (
                  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-30">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                )}

                {/* Rubik's Cube */}
                <motion.div
                  className="relative w-full h-full"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    rotateY: currentSlide * 90 + (currentSlide % 2 === 0 ? 0 : 10),
                    rotateX: currentSlide % 2 === 0 ? 15 : -15 + (currentSlide % 3 === 0 ? 0 : currentSlide % 3 === 1 ? 5 : -5),
                    rotateZ: currentSlide % 3 === 0 ? 0 : currentSlide % 3 === 1 ? 8 : -8,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1] as const
                  }}
                >
                  {/* Cube Face - Front (Slide 0) */}
                  {heroImages.length > 0 && (
                    <>
                      <CubeFace
                        image={heroImages[0] || heroImages[heroImages.length - 1]}
                        position="front"
                        isActive={currentSlide === 0}
                      />
                      
                      {/* Cube Face - Right (Slide 1) */}
                      <CubeFace
                        image={heroImages[1] || heroImages[0] || heroImages[heroImages.length - 1]}
                        position="right"
                        isActive={currentSlide === 1}
                      />
                      
                      {/* Cube Face - Back (Slide 2) */}
                      <CubeFace
                        image={heroImages[2] || heroImages[0] || heroImages[heroImages.length - 1]}
                        position="back"
                        isActive={currentSlide === 2}
                      />
                      
                      {/* Cube Face - Left (Slide 3) */}
                      <CubeFace
                        image={heroImages[3] || heroImages[0] || heroImages[heroImages.length - 1]}
                        position="left"
                        isActive={currentSlide === 3}
                      />
                      
                      {/* Cube Face - Top (Decorative) */}
                      <CubeFace
                        image={heroImages[0] || heroImages[heroImages.length - 1]}
                        position="top"
                        isActive={false}
                      />
                      
                      {/* Cube Face - Bottom (Decorative) */}
                      <CubeFace
                        image={heroImages[0] || heroImages[heroImages.length - 1]}
                        position="bottom"
                        isActive={false}
                      />
                    </>
                  )}
                </motion.div>

                {/* Navigation Arrows */}
                <motion.button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                  {heroImages.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setIsTransitioning(true)
                        setCurrentSlide(index)
                        // Preload selected image
                        const img = new Image()
                        img.src = heroImages[index].src
                        img.onload = () => setIsTransitioning(false)
                        img.onerror = () => setIsTransitioning(false)
                        // Fallback timeout
                        setTimeout(() => setIsTransitioning(false), 1000)
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-white scale-125' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Creative Students in Action Carousel Component
export const StudentsInActionCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [studentImages, setStudentImages] = useState([
    {
      src: "https://8gzcaj94vr.ufs.sh/f/97da1178-101d-4c13-aacf-c128f9005f90-yd0xy2.PNG",
      title: "Innovation in Progress",
      description: "Students working on their tech projects",
      category: "Workshop"
    },
    {
      src: "https://8gzcaj94vr.ufs.sh/f/btHfnDl3l94ioly0nL8n3I5tq8OQpHLErU6aMjx2eFAKGYW1",
      title: "Hands-on Learning",
      description: "Interactive workshops and activities",
      category: "Learning"
    },
    {
      src: "https://4fptvpb3lg.ufs.sh/f/29760ee2-0cf7-41bd-bc1d-95234783d8f6-ald1u5.jpeg",
      title: "Expert Guidance",
      description: "Learning from industry professionals",
      category: "Mentorship"
    },
    {
      src: "https://4fptvpb3lg.ufs.sh/f/2c5a6f75-c02f-49d3-a200-d751795036eb-2ak9.jpg",
      title: "Project Showcase",
      description: "Amazing student creations",
      category: "Showcase"
    }
  ])

  // Fetch students carousel from API
  useEffect(() => {
    const fetchStudentsCarousel = async () => {
      try {
        const response = await fetch("/api/content/carousels")
        const data = await response.json()
        if (data.success) {
          const studentSlides = data.data
            .filter((c: any) => c.type === "STUDENTS" && c.active)
            .sort((a: any, b: any) => a.order - b.order)
            .map((c: any) => ({
              src: c.imageUrl,
              title: c.title,
              description: c.description || "",
              category: c.category || ""
            }))
          
          if (studentSlides.length > 0) {
            setStudentImages(studentSlides)
          }
        }
      } catch (error) {
        console.error("Error fetching students carousel:", error)
      }
    }
    fetchStudentsCarousel()
  }, [])

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      const nextIndex = (currentSlide + 1) % studentImages.length
      setCurrentSlide(nextIndex)
      // Preload next image
      const img = new Image()
      img.src = studentImages[nextIndex].src
      img.onload = () => setIsTransitioning(false)
      img.onerror = () => setIsTransitioning(false)
      // Fallback timeout
      setTimeout(() => setIsTransitioning(false), 1000)
    }, 4000)
    return () => clearInterval(interval)
  }, [currentSlide, studentImages])

  const nextSlide = () => {
    setIsTransitioning(true)
    const nextIndex = (currentSlide + 1) % studentImages.length
    setCurrentSlide(nextIndex)
    // Preload next image
    const img = new Image()
    img.src = studentImages[nextIndex].src
    img.onload = () => setIsTransitioning(false)
    img.onerror = () => setIsTransitioning(false)
    // Fallback timeout
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    const prevIndex = (currentSlide - 1 + studentImages.length) % studentImages.length
    setCurrentSlide(prevIndex)
    // Preload previous image
    const img = new Image()
    img.src = studentImages[prevIndex].src
    img.onload = () => setIsTransitioning(false)
    img.onerror = () => setIsTransitioning(false)
    // Fallback timeout
    setTimeout(() => setIsTransitioning(false), 1000)
  }

  return (
    <div className="relative w-full h-[500px]">
      {/* Main Image with Creative Layout */}
      <div className="relative w-full h-full">
        {/* Loading Overlay */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-3xl flex items-center justify-center z-30">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}
        <AnimatePresence mode="wait">
          {studentImages.map((image, index) => {
            if (index !== currentSlide) return null
            
            return (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: 15,
                  z: -50
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 0,
                  z: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: -15,
                  z: -50
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeInOut" as const,
                  type: "spring",
                  stiffness: 100
                }}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Main Image with Creative Mask */}
                <div className="relative w-full h-full group">
                  <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                    <CarouselImage
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    
                    {/* Creative Overlay with Geometric Shapes */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-transparent to-gray-900/40" />
                    
                    {/* Floating Geometric Elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Creative Navigation - Circular */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            {studentImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setIsTransitioning(true)
                  setCurrentSlide(index)
                  // Preload selected image
                  const img = new Image()
                  img.src = studentImages[index].src
                  img.onload = () => setIsTransitioning(false)
                  img.onerror = () => setIsTransitioning(false)
                  // Fallback timeout
                  setTimeout(() => setIsTransitioning(false), 1000)
                }}
                className={`relative w-8 h-8 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gray-900 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === currentSlide && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gray-900 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                  index === currentSlide ? 'text-white' : 'text-gray-600'
                }`}>
                  {index + 1}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Creative Arrow Navigation */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300 z-20 shadow-lg group"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300 z-20 shadow-lg group"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </motion.button>

        {/* Minimal Content Overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {studentImages[currentSlide]?.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {studentImages[currentSlide]?.description}
                </p>
              </div>
              
              {/* Minimal Play Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Play className="w-4 h-4 ml-0.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection