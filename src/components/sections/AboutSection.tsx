"use client"

import { motion } from "framer-motion"
import { 
  Target, 
  Users, 
  Lightbulb, 
  Award, 
  Globe, 
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { StudentsInActionCarousel } from "./HeroSection"
import { useState, useEffect } from "react"
import Link from "next/link"

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

const AboutSection = () => {
  const [siteStats, setSiteStats] = useState({
    studentsReached: 1500,
    schoolsVisited: 28,
    successfulProjects: 150,
    daysOfInnovation: 3
  })

  const [siteFeatures, setSiteFeatures] = useState([
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower young innovators across Cameroon through technology, mentorship, and hands-on learning experiences.",
      color: "bg-blue-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "We provide a platform for brilliant minds to connect with industry experts and develop cutting-edge solutions.",
      color: "bg-yellow-500"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Creating a strong network of young tech enthusiasts who support and inspire each other's growth.",
      color: "bg-green-500"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Celebrating outstanding achievements and providing opportunities for students to showcase their talents.",
      color: "bg-purple-500"
    }
  ])

  // Fetch stats and features from API
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

    const fetchFeatures = async () => {
      try {
        const response = await fetch("/api/content/site-features")
        const data = await response.json()
        if (data.success && data.data.length > 0) {
          const iconMap: Record<string, any> = { Target, Lightbulb, Users, Award, Heart, Globe, Trophy, Star }
          const mapped = data.data.map((f: any) => ({
            icon: iconMap[f.iconName] || Target,
            title: f.title,
            description: f.description,
            color: f.color || "bg-blue-500"
          }))
          setSiteFeatures(mapped)
        }
      } catch (error) {
        console.error("Error fetching features:", error)
      }
    }

    fetchStats()
    fetchFeatures()
  }, [])

  // Animated counters - reinitialize when stats change
  const studentsCount = useCountUp(siteStats.studentsReached, 2500)
  const schoolsCount = useCountUp(siteStats.schoolsVisited, 2000)
  const projectsCount = useCountUp(siteStats.successfulProjects, 2000)
  const daysCount = useCountUp(siteStats.daysOfInnovation, 1500)

  // Trigger count animation when stats are loaded
  useEffect(() => {
    if (siteStats.studentsReached > 0) {
      studentsCount.setIsVisible(true)
      schoolsCount.setIsVisible(true)
      projectsCount.setIsVisible(true)
      daysCount.setIsVisible(true)
    }
  }, [siteStats])

  const stats = [
    { icon: Users, value: `${siteStats.studentsReached}+`, label: "Students Reached", color: "text-blue-500", count: studentsCount },
    { icon: Globe, value: `${siteStats.schoolsVisited}`, label: "Schools Visited", color: "text-green-500", count: schoolsCount },
    { icon: Award, value: `${siteStats.successfulProjects}`, label: "Successful Projects", color: "text-purple-500", count: projectsCount },
    { icon: Heart, value: `${siteStats.daysOfInnovation}`, label: "Days of Innovation", color: "text-red-500", count: daysCount },
  ]

  const features = siteFeatures

  const achievements = [
    "Design Thinking Workshops",
    "Business Model Canvas Training",
    "UI/UX Design Sessions",
    "TinkerCAD 3D Modeling",
    "Time Management Skills",
    "Cybersecurity Awareness",
    "Branding & Marketing",
    "Content Creation & Video Editing"
  ]

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

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 rounded-full px-4 py-2 mb-6"
            >
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">About TIC Summit</span>
            </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Empowering the Next
            <span className="block text-blue-900">
              Generation of Innovators
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            The TIC Summit has been a great success since its inception in 2021. Our volunteers and staff 
            engaged in numerous outreaches across multiple regions, reaching over 10,000
            students from over  50 different schools.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          onViewportEnter={() => {
            studentsCount.setIsVisible(true)
            schoolsCount.setIsVisible(true)
            projectsCount.setIsVisible(true)
            daysCount.setIsVisible(true)
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors duration-300 mb-4"
              >
                <stat.icon className="w-8 h-8 text-blue-900" />
              </motion.div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.count.count.toLocaleString()}{stat.value.includes('+') ? '+' : ''}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Students in Action Carousel */}
              <StudentsInActionCarousel />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h3
              variants={itemVariants}
              className="text-3xl font-bold text-gray-900 mb-6"
            >
              Comprehensive Training Program
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              During our 3-day program, participants received intensive training in 
              cutting-edge technologies and essential skills for the modern tech landscape.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{achievement}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/about">
                <Button className="bg-blue-900 hover:bg-blue-800 text-white group" size="lg">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
