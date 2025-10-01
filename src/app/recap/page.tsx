"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
import { 
  Calendar, 
  Users, 
  Award, 
  Trophy, 
  Star, 
  ArrowRight, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Globe,
  Heart,
  TrendingUp,
  Clock,
  MapPin,
  Camera,
  Video,
  Image as ImageIcon,
  ExternalLink,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Rocket,
  Crown,
  Gem,
  Flame,
  Sun,
  Moon,
  Cloud,
  Wind,
  Leaf
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"

interface Edition {
  year: number
  title: string
  theme: string
  description: string
  stats: {
    participants: number
    projects: number
    schools: number
    prizes: number
    duration: string
    location: string
  }
  highlights: string[]
  achievements: string[]
  color: string
  gradient: string
  icon: any
  images: string[]
  videos: string[]
  testimonials: {
    name: string
    role: string
    quote: string
    avatar: string
  }[]
  innovations: {
    title: string
    description: string
    impact: string
  }[]
  comingSoon?: boolean
}

const RecapPage = () => {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Animated counters for hero stats
  const yearsCount = useCountUp(6, 2000)
  const studentsCount = useCountUp(10000, 3000)
  const projectsCount = useCountUp(1000, 2500)
  const schoolsCount = useCountUp(100, 2000)

  const editions: Edition[] = [
    {
      year: 2021,
      title: "The Genesis",
      theme: "Digital Transformation",
      description: "The inaugural edition that sparked the innovation revolution in Cameroon's education system.",
      stats: {
        participants: 150,
        projects: 25,
        schools: 8,
        prizes: 3,
        duration: "2 days",
        location: "Yaoundé"
      },
      highlights: [
        "First tech challenge in Cameroon",
        "Pioneered student innovation culture",
        "Established mentorship programs",
        "Created industry partnerships"
      ],
      achievements: [
        "Launched 25 innovative projects",
        "Connected 8 schools",
        "Awarded 3 major prizes",
        "Built foundation for future editions"
      ],
      color: "from-blue-500 to-purple-600",
      gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
      icon: Sparkles,
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      videos: ["/api/placeholder/800/600"],
      testimonials: [
        {
          name: "Dr. Marie Nguema",
          role: "Education Minister",
          quote: "TIC Summit 2021 marked the beginning of a new era in Cameroonian education.",
          avatar: "/api/placeholder/60/60"
        }
      ],
      innovations: [
        {
          title: "Smart Learning Platform",
          description: "Revolutionary e-learning system for rural schools",
          impact: "Reached 10,000+ students"
        }
      ]
    },
    {
      year: 2022,
      title: "The Expansion",
      theme: "Sustainable Innovation",
      description: "Building on success, we expanded our reach and impact across Cameroon.",
      stats: {
        participants: 400,
        projects: 65,
        schools: 15,
        prizes: 5,
        duration: "3 days",
        location: "Douala & Yaoundé"
      },
      highlights: [
        "Doubled participation",
        "Expanded to multiple cities",
        "Introduced sustainability focus",
        "Launched mentorship network"
      ],
      achievements: [
        "65 groundbreaking projects",
        "15 schools participated",
        "5 major prize categories",
        "Established regional presence"
      ],
      color: "from-green-500 to-teal-600",
      gradient: "bg-gradient-to-br from-green-500 to-teal-600",
      icon: Leaf,
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      videos: ["/api/placeholder/800/600"],
      testimonials: [
        {
          name: "Jean Paul Mballa",
          role: "Student Winner",
          quote: "2022 showed me that innovation can change the world.",
          avatar: "/api/placeholder/60/60"
        }
      ],
      innovations: [
        {
          title: "Eco-Friendly Solutions",
          description: "Environmental projects that made real impact",
          impact: "Reduced waste by 30%"
        }
      ]
    },
    {
      year: 2023,
      title: "The Revolution",
      theme: "AI & Future Tech",
      description: "Embracing artificial intelligence and cutting-edge technologies for tomorrow's challenges.",
      stats: {
        participants: 750,
        projects: 120,
        schools: 25,
        prizes: 8,
        duration: "3 days",
        location: "Yaoundé, Douala, Bafoussam"
      },
      highlights: [
        "AI-focused curriculum",
        "Triple participation growth",
        "Multi-city expansion",
        "Industry partnerships"
      ],
      achievements: [
        "120 AI-powered projects",
        "25 schools nationwide",
        "8 innovation categories",
        "International recognition"
      ],
      color: "from-purple-500 to-pink-600",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
      icon: Zap,
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      videos: ["/api/placeholder/800/600"],
      testimonials: [
        {
          name: "Sarah Mboumou",
          role: "AI Project Lead",
          quote: "2023 opened doors to possibilities I never imagined.",
          avatar: "/api/placeholder/60/60"
        }
      ],
      innovations: [
        {
          title: "AI-Powered Solutions",
          description: "Machine learning projects solving real problems",
          impact: "Improved efficiency by 50%"
        }
      ]
    },
    {
      year: 2024,
      title: "The Breakthrough",
      theme: "Digital Inclusion",
      description: "Breaking barriers and ensuring technology reaches every corner of Cameroon.",
      stats: {
        participants: 1200,
        projects: 180,
        schools: 40,
        prizes: 12,
        duration: "4 days",
        location: "Nationwide"
      },
      highlights: [
        "Nationwide reach",
        "Digital inclusion focus",
        "Record participation",
        "International partnerships"
      ],
      achievements: [
        "180 innovative projects",
        "40 schools nationwide",
        "12 prize categories",
        "Global recognition"
      ],
      color: "from-orange-500 to-red-600",
      gradient: "bg-gradient-to-br from-orange-500 to-red-600",
      icon: Globe,
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      videos: ["/api/placeholder/800/600"],
      testimonials: [
        {
          name: "Dr. Pierre Nkeng",
          role: "Tech Entrepreneur",
          quote: "2024 proved that Cameroonian youth can compete globally.",
          avatar: "/api/placeholder/60/60"
        }
      ],
      innovations: [
        {
          title: "Inclusive Technology",
          description: "Solutions for underserved communities",
          impact: "Reached 50,000+ people"
        }
      ]
    },
    {
      year: 2025,
      title: "The Future",
      theme: "Next-Gen Innovation",
      description: "Pushing boundaries with emerging technologies and visionary thinking.",
      stats: {
        participants: 2000,
        projects: 300,
        schools: 60,
        prizes: 15,
        duration: "5 days",
        location: "Pan-African"
      },
      highlights: [
        "Pan-African expansion",
        "Emerging tech focus",
        "Record-breaking participation",
        "Global impact"
      ],
      achievements: [
        "300 cutting-edge projects",
        "60 schools across Africa",
        "15 innovation categories",
        "Worldwide recognition"
      ],
      color: "from-cyan-500 to-blue-600",
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
      icon: Rocket,
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      videos: ["/api/placeholder/800/600"],
      testimonials: [
        {
          name: "Aisha Diallo",
          role: "Innovation Director",
          quote: "2025 is just the beginning of something extraordinary.",
          avatar: "/api/placeholder/60/60"
        }
      ],
      innovations: [
        {
          title: "Next-Gen Solutions",
          description: "Revolutionary technologies for tomorrow",
          impact: "Transforming entire industries"
        }
      ]
    },
    {
      year: 2026,
      title: "The Evolution",
      theme: "Beyond Imagination",
      description: "The most ambitious edition yet - where dreams become reality and the impossible becomes possible.",
      stats: {
        participants: 5000,
        projects: 500,
        schools: 100,
        prizes: 25,
        duration: "7 days",
        location: "Global"
      },
      highlights: [
        "Global participation",
        "Unlimited possibilities",
        "Revolutionary technologies",
        "World-changing impact"
      ],
      achievements: [
        "500 revolutionary projects",
        "100 schools worldwide",
        "25 innovation categories",
        "Unprecedented global reach"
      ],
      color: "from-violet-500 to-purple-600",
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      icon: Crown,
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      videos: ["/api/placeholder/800/600"],
      testimonials: [
        {
          name: "Future Innovator",
          role: "Next Generation",
          quote: "The future belongs to those who dare to dream.",
          avatar: "/api/placeholder/60/60"
        }
      ],
      innovations: [
        {
          title: "Impossible Innovations",
          description: "Technologies that redefine what's possible",
          impact: "Changing the world forever"
        }
      ],
      comingSoon: true
    }
  ]

  const currentEdition = editions.find(edition => edition.year === selectedYear) || editions[0]

  // Auto-rotate images
  useEffect(() => {
    if (isPlaying && currentEdition.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % currentEdition.images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, currentEdition.images.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.6,
        ease: "easeOut",
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
    <Layout>
      <div className="min-h-screen bg-gray-900 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center space-x-2 bg-white text-gray-900 rounded-full px-4 py-2 mb-8"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">TIC Summit Recap</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Our Journey Through
                <span className="block text-white">The Years</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                From 2021 to 2026, discover how TIC Summit has grown from a local initiative 
                to a global platform for innovation and student empowerment.
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12"
                onViewportEnter={() => {
                  yearsCount.setIsVisible(true)
                  studentsCount.setIsVisible(true)
                  projectsCount.setIsVisible(true)
                  schoolsCount.setIsVisible(true)
                }}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                    {yearsCount.count}
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                    {studentsCount.count.toLocaleString()}+
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                    {projectsCount.count.toLocaleString()}+
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                    {schoolsCount.count}+
                  </div>
                  <div className="text-xs md:text-sm text-gray-300">Schools</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Navigation */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Explore Each Edition
              </h2>
              <p className="text-gray-600">
                Click on any year to dive into that specific TIC Summit edition
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line - Hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>
              
              <div className="space-y-8">
                {editions.map((edition, index) => (
                  <motion.div
                    key={edition.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col md:flex-row items-center"
                  >
                    {/* Year Button */}
                    <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
                      <motion.button
                        onClick={() => setSelectedYear(edition.year)}
                        className={`relative group ${
                          selectedYear === edition.year
                            ? 'scale-110'
                            : 'hover:scale-105'
                        } transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${
                          selectedYear === edition.year
                            ? 'bg-gray-900 ring-4 ring-gray-300'
                            : 'bg-white border-4 border-gray-200 hover:border-gray-900'
                        } flex flex-col items-center justify-center shadow-lg`}>
                          <edition.icon className={`w-6 h-6 md:w-8 md:h-8 mb-1 ${
                            selectedYear === edition.year ? 'text-white' : 'text-gray-600'
                          }`} />
                          <span className={`text-xs md:text-sm font-bold ${
                            selectedYear === edition.year ? 'text-white' : 'text-gray-900'
                          }`}>
                            {edition.year}
                          </span>
                          {edition.comingSoon && (
                            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-5 md:h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Sparkles className="w-2 h-2 md:w-3 md:h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-1/2 px-0 md:px-8">
                      <motion.div
                        className={`p-4 md:p-6 rounded-2xl ${
                          selectedYear === edition.year
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 text-gray-900'
                        } shadow-lg`}
                      >
                        <h3 className="text-lg md:text-xl font-bold mb-2">{edition.title}</h3>
                        <p className="text-xs md:text-sm mb-3 opacity-80">{edition.theme}</p>
                        <p className="text-xs md:text-sm opacity-70 line-clamp-2">{edition.description}</p>
                        {edition.comingSoon && (
                          <div className="mt-3">
                            <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full font-bold">
                              Coming Soon
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Edition Details */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto"
              >
                {/* Edition Header */}
                <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-200">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="flex-1 text-center lg:text-left">
                      <div className="inline-flex items-center space-x-2 bg-gray-900 text-white rounded-full px-4 py-2 mb-6">
                        <currentEdition.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{currentEdition.theme}</span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {currentEdition.title}
                      </h2>

                      <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                        {currentEdition.description}
                      </p>

                      {currentEdition.comingSoon && (
                        <div className="inline-flex items-center space-x-2 bg-yellow-400 text-gray-900 rounded-full px-4 py-2 font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>Coming Soon - 2026</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center">
                        <currentEdition.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12"
                >
                  {Object.entries(currentEdition.stats).map(([key, value], index) => {
                    const AnimatedStat = () => {
                      const count = useCountUp(typeof value === 'number' ? value : 0, 2000 + index * 200)
                      
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm border border-gray-200"
                          onViewportEnter={() => count.setIsVisible(true)}
                        >
                          <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                            {typeof value === 'number' ? count.count.toLocaleString() : value}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </motion.div>
                      )
                    }
                    
                    return <AnimatedStat key={key} />
                  })}
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* Highlights */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                      <Star className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-gray-600" />
                      Key Highlights
                    </h3>
                    <ul className="space-y-2 md:space-y-3">
                      {currentEdition.highlights.map((highlight, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-start space-x-3 text-sm md:text-base text-gray-700"
                        >
                          <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                          <span>{highlight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Achievements */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-gray-600" />
                      Major Achievements
                    </h3>
                    <ul className="space-y-2 md:space-y-3">
                      {currentEdition.achievements.map((achievement, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-start space-x-3 text-sm md:text-base text-gray-700"
                        >
                          <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 md:mt-16 text-center"
                >
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                      {currentEdition.comingSoon 
                        ? 'Ready for the Future?' 
                        : 'Inspired by This Edition?'
                      }
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
                      {currentEdition.comingSoon
                        ? 'Be part of the most ambitious TIC Summit yet. Register your interest and be the first to know when applications open.'
                        : 'Join us in creating the next chapter of innovation. Your journey starts here.'
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                      <Button
                        size="lg"
                        className="bg-gray-900 hover:bg-gray-800 text-white group"
                      >
                        {currentEdition.comingSoon ? 'Register Interest' : 'Join Now'}
                        <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                      >
                        <Share2 className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                        Share Story
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default RecapPage
