"use client"

import { useState, useEffect } from "react"
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
  Sparkles,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import dynamic from "next/dynamic"
// import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const Schedule26Page = () => {
  const [activePhase, setActivePhase] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeline, setTimeline] = useState<Array<{
    id: string
    title: string
    duration: string
    status: string
    description: string
    details: string[]
    icon: any
    color: string
    participants: string
  }>>([])
  const [loading, setLoading] = useState(true)

  // Fetch timeline phases from API
  useEffect(() => {
    const fetchTimelinePhases = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/content/timeline-phases")
        const data = await response.json()
        if (data.success && data.data.length > 0) {
          // Map database phases to the component format
          const mappedPhases = data.data.map((phase: any, index: number) => {
            // Find matching icon
            const iconMap: Record<string, any> = {
              Globe, Users, BookOpen, Code, Target, Presentation, Trophy
            }
            const icon = iconMap[phase.iconName] || Globe
            
            return {
              id: phase.id,
              title: phase.title,
              duration: phase.duration,
              status: phase.status.toLowerCase(),
              description: phase.description,
              details: phase.details || [],
              icon,
              color: phase.color || "bg-gray-500",
              participants: phase.participants || ""
            }
          })
          
          setTimeline(mappedPhases)
          
          // Set active phase index
          const activeIndex = mappedPhases.findIndex((p: any) => p.status === "active")
          if (activeIndex !== -1) {
            setActivePhase(activeIndex)
          } else {
            // If no active phase, default to first phase
            setActivePhase(0)
          }
        }
      } catch (error) {
        console.error("Error fetching timeline phases:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTimelinePhases()
  }, [])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "active":
        return <Circle className="w-5 h-5 text-gray-900 fill-current animate-pulse" />
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
        return "border-gray-900 bg-gray-100"
      case "upcoming":
        return "border-gray-300 bg-gray-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-900 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading timeline...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (timeline.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Timeline Data</h2>
            <p className="text-gray-600">Timeline phases will appear here once configured.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-gray-900 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-2 relative z-10">
            <div className="text-center text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Calendar className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">TIC Summit 2026 Timeline</span>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Overview */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Timeline Overview</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Visual representation of the complete TIC Summit 2026 journey
              </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>
              
              {/* Timeline Items */}
              <div className="space-y-16">
                {timeline.map((phase, index) => {
                  const isActive = phase.status === "active"
                  return (
                  <div
                    key={phase.id}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Timeline Card */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <div 
                        className={`rounded-2xl p-6 shadow-xl border-2 hover:shadow-2xl transition-shadow duration-300 ${
                          isActive 
                            ? 'bg-gray-100 border-gray-900 ring-4 ring-gray-300 ring-opacity-50' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {/* Active Badge */}
                        {isActive && (
                          <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 mr-2">
                            LIVE NOW
                          </div>
                        )}
                        
                        {/* Date Badge */}
                        <div 
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                            isActive ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {phase.duration}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-3 text-gray-900">
                          {phase.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 mb-4">
                          {phase.description}
                        </p>
                        
                        {/* Activities */}
                        <div className="space-y-2">
                          {phase.details.slice(0, 3).map((detail, detailIndex) => (
                            <div 
                              key={detailIndex} 
                              className="flex items-center space-x-2"
                            >
                              <div className={`w-2 h-2 rounded-full ${phase.color.replace('bg-', 'bg-').replace('-500', '-400')}`}></div>
                              <span className="text-gray-600 text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Node */}
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center relative">
                      <div 
                        className={`w-12 h-12 ${phase.color} rounded-full flex items-center justify-center shadow-lg ${
                          isActive ? 'ring-4 ring-gray-400 ring-offset-2' : ''
                        }`}
                      >
                        <span className="text-white font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    
                    {/* Spacer */}
                    <div className="w-5/12"></div>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Current Phase Section */}
        <section className="py-16 bg-gray-900" id="current-phase">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* LIVE NOW Badge */}
              <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium mb-6">
                LIVE NOW
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-8">Current Phase</h2>
              
              {/* Current Phase Card */}
              <div className="max-w-4xl mx-auto relative overflow-hidden">
                {/* Border */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    padding: "2px",
                    background: "linear-gradient(45deg, #111827, #374151, #6b7280, #111827)",
                    backgroundSize: "400% 400%"
                  }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 relative">
                    {/* Content */}
                    <div className="relative z-10">
                  {/* Phase Header */}
                  {timeline.length > 0 && timeline[activePhase] && (
                    <>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 ${timeline[activePhase]?.color || 'bg-gray-900'} rounded-2xl flex items-center justify-center`}>
                      {(() => {
                        const IconComponent = timeline[activePhase]?.icon || BookOpen
                        return <IconComponent className="w-8 h-8 text-white" />
                      })()}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{timeline[activePhase]?.title || 'Current Phase'}</h3>
                      <p className="text-gray-600">{timeline[activePhase]?.duration || ''}</p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {timeline[activePhase]?.description || 'No description available'}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">12+</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Schools Visited</div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">2,500+</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Students Reached</div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">18</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Days Remaining</div>
                    </div>
                  </div>
                  
                  {/* Activities */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {(timeline[activePhase]?.details || []).map((detail, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-gray-100 rounded-lg p-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${(timeline[activePhase]?.color || 'bg-gray-900').replace('bg-', 'bg-').replace('-500', '-400')}`}></div>
                        <span className="text-gray-700 text-sm leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center">
                    <Button 
                      className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg"
                      onClick={() => {
                        const emailSubject = 'TIC Summit 2026 Volunteer Application'
                        const emailBody = `Dear TIC Summit Team,

I am writing to express my interest in volunteering for TIC Summit 2026.

Personal Information:
- Name: [Your Full Name]
- Email: [Your Email Address]
- Phone: [Your Phone Number]

Volunteer Application Details:
- Preferred Role: [e.g., Event Coordinator, Mentor, Technical Support, etc.]

Relevant Experience:
[Briefly describe your relevant experience, skills, or background]

Motivation:
[Tell us what motivates you to volunteer for TIC Summit 2026]

Availability:
[When are you available? (e.g., Weekends, Evenings, Specific dates...)]

I am excited about the opportunity to contribute to TIC Summit 2026 and help make it a success. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Email]
[Your Phone Number]`
                        const mailtoLink = `mailto:info@ticsummit.org?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
                        window.open(mailtoLink)
                      }}
                    >
                      Do you want to volunteer? Apply here
                    </Button>
                  </div>
                  </>
                  )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 pb-48 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Join the Journey?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Be part of TIC Summit 2026 and shape the future of technology and innovation.
              </p>
              <div className="flex justify-center">
                <Button 
                  size="xl" 
                  className="bg-gray-900 hover:bg-gray-800 text-white group"
                  onClick={() => {
                    const emailSubject = 'TIC Summit 2026 Volunteer Application'
                    const emailBody = `Dear TIC Summit Team,

I am writing to express my interest in volunteering for TIC Summit 2026.

Personal Information:
- Name: [Your Full Name]
- Email: [Your Email Address]
- Phone: [Your Phone Number]

Volunteer Application Details:
- Preferred Role: [e.g., Event Coordinator, Mentor, Technical Support, etc.]

Relevant Experience:
[Briefly describe your relevant experience, skills, or background]

Motivation:
[Tell us what motivates you to volunteer for TIC Summit 2026]

Availability:
[When are you available? (e.g., Weekends, Evenings, Specific dates...)]

I am excited about the opportunity to contribute to TIC Summit 2026 and help make it a success. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Email]
[Your Phone Number]`
                    const mailtoLink = `mailto:info@ticsummit.org?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
                    window.open(mailtoLink)
                  }}
                >
                  Do you want to volunteer? Apply here
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Volunteer Application Modal - Commented out for now */}
      {/* <AnimatePresence>
        {showVolunteerModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-auto"
            >
              Modal content commented out
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}
    </Layout>
  )
}

export default Schedule26Page
