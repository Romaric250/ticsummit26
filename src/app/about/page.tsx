"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Target, 
  Users, 
  Lightbulb, 
  Globe, 
  Heart,
  ArrowRight,
  Trophy,
  Quote,
  Play,
  Linkedin,
  Github,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Image from "next/image"

interface Alumni {
  id: string
  slug: string
  name: string
  email: string
  profileImage?: string
  bio?: string
  graduationYear?: number
  currentRole?: string
  company?: string
  location?: string
  achievements: string[]
  socialLinks?: Record<string, string>
  isActive: boolean
  createdAt: string
  updatedAt: string
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

const AboutPage = () => {
  const [ticImpact, setTicImpact] = useState({
    studentsInspired: 1000,
    teenagersTrained: 5000,
    prizeAwardsFCFA: 2.0,
    ticClubsEstablished: 25,
    subtitle: "in 4 Years",
    description: "Transforming lives and building the future of tech in Cameroon"
  })

  // Alumni state
  const [featuredAlumni, setFeaturedAlumni] = useState<Alumni[]>([])
  const [alumniLoading, setAlumniLoading] = useState(true)

  // Founder quote state
  const [founderQuote, setFounderQuote] = useState({
    initial: "P",
    name: "Dr. Pierre Nkeng",
    title: "Founder & CEO, TIC Summit",
    quote: "When we started TIC Summit, we had a simple vision: to unlock the incredible potential of young minds across Cameroon. Today, seeing thousands of students transformed into innovators, entrepreneurs, and tech leaders, I know we've created something truly special.",
    imageUrl: ""
  })

  // Team members state
  const [teamMembers, setTeamMembers] = useState<Array<{
    id: string
    slug?: string
    name: string
    role: string
    bio?: string
    imageUrl?: string
    email?: string
    socialLinks?: {
      linkedin?: string
      twitter?: string
      github?: string
      email?: string
    }
  }>>([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [showTeamSection, setShowTeamSection] = useState(true)

  // Mission/Vision/Values state
  const [mvv, setMvv] = useState({
    mission: "Empower young innovators through technology, mentorship, and hands-on learning experiences.",
    vision: "Create a thriving ecosystem where young minds can innovate and build the future of Cameroon.",
    values: "Innovation, collaboration, excellence, and impact drive everything we do.",
    introText: "The summit provides a platform for these brilliant minds to connect with industry experts, gain valuable mentorship, and win prizes for their innovative ideas. We believe that every young person has the potential to change the world through technology."
  })

  // Fetch TIC Impact from API
  useEffect(() => {
    const fetchTICImpact = async () => {
      try {
        const response = await fetch("/api/content/tic-impact")
        const data = await response.json()
        if (data.success && data.data) {
          setTicImpact(data.data)
        }
      } catch (error) {
        console.error("Error fetching TIC impact:", error)
      }
    }
    fetchTICImpact()
  }, [])

  // Fetch Mission/Vision/Values from API
  useEffect(() => {
    const fetchMVV = async () => {
      try {
        const response = await fetch("/api/content/mission-vision-values")
        const data = await response.json()
        if (data.success && data.data) {
          setMvv(data.data)
        }
      } catch (error) {
        console.error("Error fetching mission/vision/values:", error)
      }
    }
    fetchMVV()
  }, [])

  // Fetch team members and settings
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setTeamLoading(true)
        const [teamRes, settingsRes] = await Promise.all([
          fetch("/api/content/team-members"),
          fetch("/api/content/site-settings")
        ])

        if (teamRes.ok) {
          const teamData = await teamRes.json()
          if (teamData.success) {
            const activeMembers = teamData.data
              .filter((m: any) => m.active)
              .sort((a: any, b: any) => a.order - b.order)
            setTeamMembers(activeMembers)
          }
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          if (settingsData.success && settingsData.data) {
            setShowTeamSection(settingsData.data.showTeamSection !== false)
          }
        }
      } catch (error) {
        console.error("Error fetching team data:", error)
      } finally {
        setTeamLoading(false)
      }
    }
    fetchTeamData()
  }, [])

  useEffect(() => {
    fetchFeaturedAlumni()
    
    // Fetch founder quote
    const fetchFounderQuote = async () => {
      try {
        const response = await fetch("/api/content/founder-quote")
        const data = await response.json()
        if (data.success && data.data) {
          setFounderQuote(data.data)
        }
      } catch (error) {
        console.error("Error fetching founder quote:", error)
      }
    }
    fetchFounderQuote()
  }, [])

  // Animated counters - reinitialize when impact changes
  const studentsCount = useCountUp(ticImpact.studentsInspired, 3000)
  const teenagersCount = useCountUp(ticImpact.teenagersTrained, 3500)
  const prizeCount = useCountUp(ticImpact.prizeAwardsFCFA, 2500)
  const clubsCount = useCountUp(ticImpact.ticClubsEstablished, 2000)

  // Trigger count animation when impact data is loaded
  useEffect(() => {
    if (ticImpact.studentsInspired > 0) {
      // Reset visibility to trigger animation
      studentsCount.setIsVisible(false)
      teenagersCount.setIsVisible(false)
      prizeCount.setIsVisible(false)
      clubsCount.setIsVisible(false)
      
      // Trigger animation after a brief delay
      setTimeout(() => {
        studentsCount.setIsVisible(true)
        teenagersCount.setIsVisible(true)
        prizeCount.setIsVisible(true)
        clubsCount.setIsVisible(true)
      }, 100)
    }
  }, [ticImpact.studentsInspired, ticImpact.teenagersTrained, ticImpact.prizeAwardsFCFA, ticImpact.ticClubsEstablished])

  const fetchFeaturedAlumni = async () => {
    try {
      setAlumniLoading(true)
      const response = await fetch("/api/alumni/featured?limit=3")
      const data = await response.json()
      
      if (data.success) {
        setFeaturedAlumni(data.data)
      }
    } catch (error) {
      console.error("Error fetching featured alumni:", error)
    } finally {
      setAlumniLoading(false)
    }
  }

  const timeline = [
    {
      day: 1,
      title: "Opening Day",
      description: "Hands-on prototyping workshops and collaborative ideation sessions to bring ideas to life.",
      icon: Lightbulb
    },
    {
      day: 2,
      title: "Mentorship & Growth",
      description: "Personalized guidance, expert insights, and project pitching workshops for semi-finals preparation.",
      icon: Users
    },
    {
      day: 3,
      title: "Grand Finale",
      description: "Compelling project pitches to esteemed judges, keynote speakers, and winner announcements.",
      icon: Trophy
    }
  ]

  const impactStats = [
    {
      number: ticImpact.studentsInspired,
      suffix: "+",
      label: "Students inspired to pursue tech careers",
      icon: Users,
      count: studentsCount
    },
    {
      number: ticImpact.teenagersTrained,
      suffix: "+",
      label: "Teenagers trained with technical skills",
      icon: Lightbulb,
      count: teenagersCount
    },
    {
      number: ticImpact.prizeAwardsFCFA,
      suffix: "M FCFA",
      label: "In prize awards and scholarships",
      icon: Trophy,
      count: prizeCount
    },
    {
      number: ticImpact.ticClubsEstablished,
      suffix: "+",
      label: "TIC clubs established across Cameroon",
      icon: Globe,
      count: clubsCount
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 bg-white text-gray-900 rounded-full px-4 py-2 mb-8"
              >
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">About TIC Summit</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl font-bold text-white mb-6"
              >
                What is the
                <span className="block text-blue-400">TIC Summit?</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
              >
                The TIC Summit is an exciting Tech Innovation Challenge that gathers teams of secondary and high school students from diverse schools in Cameroon to showcase their problem-solving skills using technology.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Empowering the Next Generation of
                <span className="block text-blue-900">Tech Innovators</span>
              </h2>
              
              {mvv.introText && (
                <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                  {mvv.introText}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600">{mvv.mission}</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600">{mvv.vision}</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Values</h3>
                  <p className="text-gray-600">{mvv.values}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        {/* <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Current Summit
                <span className="block text-blue-900">Timeline</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the complete journey of innovation over three transformative days
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {timeline.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <day.icon className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {day.title}
                          </h3>
                          <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                            Day {day.day}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* Impact Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                TIC's Impact
                {ticImpact.subtitle && (
                  <span className="block text-blue-900">{ticImpact.subtitle}</span>
                )}
              </h2>
              {ticImpact.description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {ticImpact.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                  onViewportEnter={() => {
                    if (index === 0) studentsCount.setIsVisible(true)
                    if (index === 1) teenagersCount.setIsVisible(true)
                    if (index === 2) prizeCount.setIsVisible(true)
                    if (index === 3) clubsCount.setIsVisible(true)
                  }}
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <stat.icon className="w-10 h-10 text-gray-900" />
                  </div>
                  
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.count.count.toLocaleString()}{stat.suffix}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Alumni Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Alumni
                <span className="block text-blue-900">Success Stories</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet some of our incredible alumni who are making waves in the tech world
              </p>
            </div>

            {alumniLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center animate-pulse">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4 mx-auto"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredAlumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featuredAlumni.map((alumnus, index) => (
                  <Link key={alumnus.id} href={`/alumni/${alumnus.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                        {alumnus.profileImage ? (
                          <Image
                            src={alumnus.profileImage}
                            alt={alumnus.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-2xl">
                            {alumnus.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {alumnus.name}
                      </h3>
                      
                      {alumnus.currentRole && (
                        <p className="text-blue-600 font-semibold mb-2">
                          {alumnus.currentRole}
                        </p>
                      )}
                      
                      {alumnus.company && (
                        <p className="text-gray-600 text-sm mb-4">
                          {alumnus.company}
                        </p>
                      )}
                      
                      {alumnus.bio && (
                        <blockquote className="text-gray-700 italic text-sm">
                          "{alumnus.bio.length > 100 ? `${alumnus.bio.substring(0, 100)}...` : alumnus.bio}"
                        </blockquote>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No alumni yet</h3>
                <p className="text-gray-500">Check back soon for inspiring success stories!</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/alumni">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white group"
                >
                  View All Alumni
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {showTeamSection && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Team Behind the Summit
                  <span className="block text-blue-900">Our Amazing Team</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Meet the dedicated team working tirelessly to make TIC Summit a success
                </p>
              </div>

              {teamLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center animate-pulse">
                      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4 w-3/4 mx-auto"></div>
                      <div className="h-3 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {teamMembers.map((member, index) => (
                    <Link key={member.id || index} href={member.slug ? `/team/${member.slug}` : "#"}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow cursor-pointer"
                      >
                      <div className="w-24 h-24 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-3xl">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      
                      {member.role && (
                        <p className="text-blue-600 font-semibold mb-3">
                          {member.role}
                        </p>
                      )}
                      
                      {member.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {member.bio}
                        </p>
                      )}

                      {/* Social Links */}
                      {(member.socialLinks?.linkedin || member.socialLinks?.twitter || member.socialLinks?.github || member.email) && (
                        <div className="flex justify-center gap-3 mt-4">
                          {member.socialLinks?.linkedin && (
                            <a
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              aria-label="LinkedIn"
                            >
                              <Linkedin className="w-5 h-5" />
                            </a>
                          )}
                          {member.socialLinks?.twitter && (
                            <a
                              href={member.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-400 transition-colors"
                              aria-label="Twitter"
                            >
                              <span className="w-5 h-5 flex items-center justify-center text-sm">𝕏</span>
                            </a>
                          )}
                          {member.socialLinks?.github && (
                            <a
                              href={member.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-900 transition-colors"
                              aria-label="GitHub"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-gray-400 hover:text-gray-900 transition-colors"
                              aria-label="Email"
                            >
                              <Mail className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      )}
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Users className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No team members yet</h3>
                  <p className="text-gray-500">Team members will appear here once added.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Founder's Message */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-white">
                <div className="text-center mb-8">
                  <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden relative">
                    {founderQuote.imageUrl ? (
                      <Image
                        src={founderQuote.imageUrl}
                        alt={founderQuote.name}
                        width={192}
                        height={192}
                        className="object-cover rounded-full w-full h-full scale-110"
                        style={{ objectPosition: 'center top' }}
                        unoptimized
                      />
                    ) : (
                      <span className="text-gray-900 font-bold text-4xl md:text-5xl">{founderQuote.initial}</span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {founderQuote.name}
                  </h3>
                  
                  <p className="text-blue-300 mb-6">
                    {founderQuote.title}
                  </p>
                </div>
                
                <div className="text-center">
                  <Quote className="w-8 h-8 text-blue-300 mx-auto mb-6" />
                  
                  <blockquote className="text-lg leading-relaxed">
                    "{founderQuote.quote}"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Join the
                <span className="block text-blue-400">Innovation Revolution?</span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Be part of the next generation of tech innovators. Apply now and start your journey towards transforming Cameroon through technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default AboutPage