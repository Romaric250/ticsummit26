"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  Target,
  ArrowRight,
  CheckCircle,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Rocket,
  Lightbulb,
  Trophy,
  Star,
  BookOpen,
  Code,
  Presentation,
  Mic,
  Camera,
  Globe,
  Heart,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import dynamic from "next/dynamic"

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const Schedule26Page = () => {
  const [activePhase, setActivePhase] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const timeline = [
    {
      id: "outreach",
      title: "Outreach & School Visits",
      duration: "Jan - Mar 2025",
      status: "completed",
      description: "Visiting schools across Cameroon to introduce TIC Summit and form tech clubs",
      details: [
        "Visit 50+ secondary and high schools",
        "Present TIC Summit program to students",
        "Establish tech clubs in participating schools",
        "Train club mentors and coordinators"
      ],
      icon: Globe,
      color: "bg-green-500",
      participants: "5000+ students"
    },
    {
      id: "club-formation",
      title: "TICTAP Club Formation",
      duration: "Mar - Apr 2025",
      status: "completed",
      description: "Forming and organizing tech clubs in schools with structured mentorship",
      details: [
        "Establish 100+ TICTAP clubs nationwide",
        "Assign industry mentors to each club",
        "Provide learning resources and materials",
        "Set up online collaboration platforms"
      ],
      icon: Users,
      color: "bg-blue-500",
      participants: "2000+ club members"
    },
    {
      id: "mentorship",
      title: "Club Mentorship Program",
      duration: "Apr - Jun 2025",
      status: "active",
      description: "Ongoing mentorship and skill development for club members",
      details: [
        "Weekly mentorship sessions",
        "Technical skill workshops",
        "Project-based learning",
        "Industry expert guest sessions"
      ],
      icon: BookOpen,
      color: "bg-purple-500",
      participants: "1500+ active members"
    },
    {
      id: "mini-hackathons",
      title: "Mini Hackathons",
      duration: "Jun - Aug 2025",
      status: "upcoming",
      description: "Regional mini hackathons to prepare students for the main summit",
      details: [
        "6 regional mini hackathons",
        "48-hour coding challenges",
        "Industry judges and mentors",
        "Prizes and recognition for winners"
      ],
      icon: Code,
      color: "bg-orange-500",
      participants: "800+ participants"
    },
    {
      id: "project-submission",
      title: "Project Submission",
      duration: "Aug - Sep 2025",
      status: "upcoming",
      description: "Students submit their innovative projects for summit consideration",
      details: [
        "Project proposal submissions",
        "Technical documentation review",
        "Innovation and impact assessment",
        "Selection for semifinals"
      ],
      icon: Target,
      color: "bg-red-500",
      participants: "500+ projects"
    },
    {
      id: "semifinals",
      title: "Semifinals",
      duration: "Sep - Oct 2025",
      status: "upcoming",
      description: "Regional semifinals to select the best projects for the main summit",
      details: [
        "Regional semifinal competitions",
        "Project presentations and demos",
        "Technical interviews",
        "Selection of finalists"
      ],
      icon: Presentation,
      color: "bg-indigo-500",
      participants: "100+ semifinalists"
    },
    {
      id: "finals",
      title: "TIC Summit Finals",
      duration: "Nov 2025",
      status: "upcoming",
      description: "The grand finale - 3 days of innovation, competition, and celebration",
      details: [
        "3-day intensive summit",
        "Final project presentations",
        "Industry networking sessions",
        "Awards ceremony and celebration"
      ],
      icon: Trophy,
      color: "bg-yellow-500",
      participants: "50+ finalists"
    }
  ]

  const chartOptions = {
    chart: {
      type: 'timeline',
      height: 400,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      timeline: {
        dataLabels: {
          hideOverlappingLabels: false
        }
      }
    },
    xaxis: {
      categories: timeline.map(phase => phase.title)
    },
    colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#EAB308'],
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return val
      }
    },
    legend: {
      show: false
    }
  }

  const chartSeries = [{
    data: timeline.map((phase, index) => ({
      x: phase.title,
      y: [
        new Date(2025, 0, 1).getTime(),
        new Date(2025, 2, 31).getTime()
      ]
    }))
  }]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "active":
        return <Circle className="w-5 h-5 text-blue-500 fill-current animate-pulse" />
      case "upcoming":
        return <Circle className="w-5 h-5 text-gray-400" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50"
      case "active":
        return "border-blue-500 bg-blue-50"
      case "upcoming":
        return "border-gray-300 bg-gray-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-gray-900 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Calendar className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">TIC Summit 2026 Timeline</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-white">Journey to</span>
                <span className="block text-white">Innovation</span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                From school outreach to the grand finale - follow the complete journey of TIC Summit 2026
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>5000+ Students Reached</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>7 Phases of Innovation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>11 Months Journey</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Overview */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Timeline Overview</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Visual representation of the complete TIC Summit 2026 journey
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{ originY: 0 }}
              ></motion.div>
              
              {/* Timeline Items */}
              <div className="space-y-16">
                {timeline.map((phase, index) => (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Timeline Card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <motion.div 
                        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 !bg-white"
                        whileHover={{ scale: 1.02, y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        {/* Date Badge */}
                        <motion.div 
                          className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-4"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                        >
                          {phase.duration}
                        </motion.div>
                        
                        {/* Title */}
                        <motion.h3 
                          className="text-2xl font-bold text-gray-900 mb-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        >
                          {phase.title}
                        </motion.h3>
                        
                        {/* Description */}
                        <motion.p 
                          className="text-gray-600 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                        >
                          {phase.description}
                        </motion.p>
                        
                        {/* Activities */}
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                        >
                          {phase.details.slice(0, 3).map((detail, detailIndex) => (
                            <motion.div 
                              key={detailIndex} 
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 + 0.6 + detailIndex * 0.1 }}
                            >
                              <div className={`w-2 h-2 rounded-full ${phase.color.replace('bg-', 'bg-').replace('-500', '-400')}`}></div>
                              <span className="text-gray-600 text-sm">{detail}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    {/* Timeline Node */}
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <motion.div 
                        className={`w-12 h-12 ${phase.color} rounded-full flex items-center justify-center shadow-lg`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.1 + 0.3,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <motion.span 
                          className="text-white font-bold text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
                        >
                          {index + 1}
                        </motion.span>
                      </motion.div>
                    </div>
                    
                    {/* Spacer */}
                    <div className="w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Current Phase Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* LIVE NOW Badge */}
              <motion.div 
                className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium mb-6 relative overflow-hidden"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.4)",
                    "0 0 0 10px rgba(59, 130, 246, 0)",
                    "0 0 0 0 rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  LIVE NOW
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-8">Current Phase</h2>
              
              {/* Current Phase Card */}
              <div className="max-w-4xl mx-auto relative overflow-hidden">
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)",
                      "linear-gradient(45deg, #8b5cf6, #06b6d4, #3b82f6, #8b5cf6)",
                      "linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)",
                      "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    padding: "2px",
                    background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)",
                    backgroundSize: "400% 400%"
                  }}
                >
                  <motion.div 
                    className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 relative"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 40px rgba(59, 130, 246, 0.6)",
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {/* Pulsing Background Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl"
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.01, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                  {/* Phase Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 ${timeline[activePhase].color} rounded-2xl flex items-center justify-center`}>
                      {(() => {
                        const IconComponent = timeline[activePhase].icon
                        return <IconComponent className="w-8 h-8 text-white" />
                      })()}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{timeline[activePhase].title}</h3>
                      <p className="text-gray-400">{timeline[activePhase].duration}</p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {timeline[activePhase].description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-700 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-2">12+</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Schools Visited</div>
                    </div>
                    <div className="bg-gray-700 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-2">2,500+</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Students Reached</div>
                    </div>
                    <div className="bg-gray-700 rounded-xl p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-2">18</div>
                      <div className="text-gray-400 text-xs sm:text-sm">Days Remaining</div>
                    </div>
                  </div>
                  
                  {/* Activities */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {timeline[activePhase].details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-gray-700 rounded-lg p-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${timeline[activePhase].color.replace('bg-', 'bg-').replace('-500', '-400')}`}></div>
                        <span className="text-gray-300 text-sm leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center">
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg">
                      Do you want to volunteer? Apply here
                    </Button>
                  </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 pb-48 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Join the Journey?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Be part of TIC Summit 2026 and shape the future of technology and innovation.
              </p>
              <div className="flex justify-center">
                <Button size="xl" className="bg-gray-900 hover:bg-gray-800 text-white group">
                  Do you want to volunteer? Apply here
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Schedule26Page
