"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Play, Users, Award, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useState, useEffect } from "react"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const heroImages = [
    {
      src: "https://8gzcaj94vr.ufs.sh/f/97da1178-101d-4c13-aacf-c128f9005f90-yd0xy2.PNG",
      title: "TIC Summit 2025",
      subtitle: "Students and Innovation",
      description: "Cameroon's largest tech challenge"
    },
    {
      src: "https://8gzcaj94vr.ufs.sh/f/btHfnDl3l94ioly0nL8n3I5tq8OQpHLErU6aMjx2eFAKGYW1",
      title: "Hands-on Learning",
      subtitle: "Workshops & Activities",
      description: "Interactive tech sessions"
    },
    {
      src: "https://4fptvpb3lg.ufs.sh/f/29760ee2-0cf7-41bd-bc1d-95234783d8f6-ald1u5.jpeg",
      title: "Expert Mentorship",
      subtitle: "Industry Leaders",
      description: "Learn from the best"
    },
    {
      src: "https://4fptvpb3lg.ufs.sh/f/2c5a6f75-c02f-49d3-a200-d751795036eb-2ak9.jpg",
      title: "Innovation Showcase",
      subtitle: "Student Projects",
      description: "Amazing creations"
    }
  ]

  const stats = [
    { icon: Users, value: "1500+", label: "Students Reached" },
    { icon: Award, value: "28", label: "Schools Visited" },
    { icon: Calendar, value: "3", label: "Days of Innovation" },
  ]

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
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
        ease: "easeOut" as const,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-2 mb-6"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Registration Now Open
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              <span className="block">TIC Summit</span>
              <span className="block text-white">
                2025
              </span>
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
              Cameroon's largest tech challenge for Secondary and High school students. 
              Connect with industry experts, gain valuable mentorship, and win prizes 
              for your innovative ideas.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="xl"
                className="bg-white hover:bg-white text-gray-900 group"
              >
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="xl"
                variant="outline"
                className="group border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Video
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - 3D Hero Slider */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative h-[500px] perspective-1000">
              {/* 3D Slider Container */}
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  {heroImages.map((image, index) => {
                    if (index !== currentSlide) return null
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ 
                          opacity: 0, 
                          scale: 0.8, 
                          rotateY: 45,
                          z: -100
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
                          rotateY: -45,
                          z: -100
                        }}
                        transition={{ 
                          duration: 0.8, 
                          ease: "easeInOut" as const,
                          type: "spring",
                          stiffness: 100
                        }}
                        className="absolute inset-0"
                        style={{
                          transformStyle: "preserve-3d"
                        }}
                      >
                        {/* Main Image Card */}
                        <div className="relative w-full h-full group">
                          <div className="w-full h-full rounded-3xl backdrop-blur-sm border border-white/20 overflow-hidden shadow-2xl transform-gpu">
                            <img 
                              src={image.src}
                              alt={image.title}
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                            />
                            
                            {/* Image Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                            
                            {/* Image Info */}
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                              <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold mb-2"
                              >
                                {image.title}
                              </motion.h3>
                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg opacity-90 mb-1"
                              >
                                {image.subtitle}
                              </motion.p>
                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm opacity-75"
                              >
                                {image.description}
                              </motion.p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

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
                      onClick={() => setCurrentSlide(index)}
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

                {/* Floating Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -50, y: 50 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 z-10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">150+</div>
                      <div className="text-white text-sm">Projects</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50, y: -50 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 z-10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">3 Days</div>
                      <div className="text-white text-sm">Intensive</div>
                    </div>
                  </div>
                </motion.div>
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

// Students in Action Carousel Component
export const StudentsInActionCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const studentImages = [
    {
      src: "https://8gzcaj94vr.ufs.sh/f/97da1178-101d-4c13-aacf-c128f9005f90-yd0xy2.PNG",
      title: "Innovation in Progress",
      description: "Students working on their tech projects"
    },
    {
      src: "https://8gzcaj94vr.ufs.sh/f/btHfnDl3l94ioly0nL8n3I5tq8OQpHLErU6aMjx2eFAKGYW1",
      title: "Hands-on Learning",
      description: "Interactive workshops and activities"
    },
    {
      src: "https://4fptvpb3lg.ufs.sh/f/29760ee2-0cf7-41bd-bc1d-95234783d8f6-ald1u5.jpeg",
      title: "Expert Guidance",
      description: "Learning from industry professionals"
    },
    {
      src: "https://4fptvpb3lg.ufs.sh/f/2c5a6f75-c02f-49d3-a200-d751795036eb-2ak9.jpg",
      title: "Project Showcase",
      description: "Amazing student creations"
    }
  ]

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % studentImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % studentImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + studentImages.length) % studentImages.length)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Students in <span className="text-gray-600">Action</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See our students in action as they work on innovative projects, 
            learn from experts, and showcase their amazing creations.
          </p>
        </motion.div>

        {/* Modified Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative h-[400px] overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              {studentImages.map((image, index) => {
                if (index !== currentSlide) return null
                
                return (
                  <motion.div
                    key={index}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.9,
                      x: 100
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: 0
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.9,
                      x: -100
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeInOut" as const
                    }}
                    className="absolute inset-0"
                  >
                    <div className="relative w-full h-full group">
                      <img 
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl font-bold mb-2"
                        >
                          {image.title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg opacity-90"
                        >
                          {image.description}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Navigation Arrows */}
            <motion.button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300 z-20 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300 z-20 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {studentImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection