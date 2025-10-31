"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, Plus, Trash2, Edit, X, ImageIcon, ArrowUp, ArrowDown, Users, FileText, Quote, BarChart3, Lightbulb, Target, Award, Heart, Globe, Trophy, Star, Mail, Phone, MapPin } from "lucide-react"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { useUploadThing } from "@/lib/uploadthing"

interface FounderQuote {
  id?: string
  initial: string
  name: string
  title: string
  quote: string
  imageUrl?: string
}

interface CarouselSlide {
  id?: string
  imageUrl: string
  title: string
  subtitle?: string
  description?: string
  category?: string
  order: number
  active: boolean
}

interface TeamMember {
  id?: string
  name: string
  slug: string
  role: string
  bio?: string
  imageUrl?: string
  email?: string
  linkedin?: string
  twitter?: string
  github?: string
  order: number
  active: boolean
}

interface FAQ {
  id?: string
  question: string
  answer: string
  order: number
  active: boolean
}

interface Partner {
  id?: string
  name: string
  logoUrl: string
  website?: string
  order: number
  active: boolean
}

const MinorUpdatesPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Founder Quote State
  const [founderQuote, setFounderQuote] = useState<FounderQuote>({
    initial: "P",
    name: "Dr. Pierre Nkeng",
    title: "Founder & CEO, TIC Summit",
    quote: "When we started TIC Summit, we had a simple vision: to unlock the incredible potential of young minds across Cameroon. Today, seeing thousands of students transformed into innovators, entrepreneurs, and tech leaders, I know we've created something truly special."
  })

  // Carousels State
  const [heroCarousel, setHeroCarousel] = useState<CarouselSlide[]>([])
  const [studentsCarousel, setStudentsCarousel] = useState<CarouselSlide[]>([])
  
  // Team Members State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  // FAQ State
  const [faqs, setFaqs] = useState<FAQ[]>([])

  // Partners State
  const [partners, setPartners] = useState<Partner[]>([])

  // Site Stats State
  const [siteStats, setSiteStats] = useState({
    studentsReached: 1500,
    schoolsVisited: 28,
    successfulProjects: 150,
    daysOfInnovation: 3
  })

  // Site Features State
  const [siteFeatures, setSiteFeatures] = useState<Array<{ id: string; title: string; description: string; iconName?: string; color?: string; order: number; active: boolean; introText?: string }>>([
    { id: "", title: "Our Mission", description: "To empower young innovators across Cameroon through technology, mentorship, and hands-on learning experiences.", iconName: "Target", color: "bg-blue-500", order: 0, active: true },
    { id: "", title: "Innovation Focus", description: "We provide a platform for brilliant minds to connect with industry experts and develop cutting-edge solutions.", iconName: "Lightbulb", color: "bg-yellow-500", order: 1, active: true },
    { id: "", title: "Community Building", description: "Creating a strong network of young tech enthusiasts who support and inspire each other's growth.", iconName: "Users", color: "bg-green-500", order: 2, active: true },
    { id: "", title: "Recognition", description: "Celebrating outstanding achievements and providing opportunities for students to showcase their talents.", iconName: "Award", color: "bg-purple-500", order: 3, active: true }
  ])

  // TIC Impact State
  const [ticImpact, setTicImpact] = useState<{ studentsInspired: number; teenagersTrained: number; prizeAwardsFCFA: number; ticClubsEstablished: number; subtitle?: string; description?: string }>({
    studentsInspired: 1000,
    teenagersTrained: 5000,
    prizeAwardsFCFA: 2.0,
    ticClubsEstablished: 25,
    subtitle: "in 4 Years",
    description: "Transforming lives and building the future of tech in Cameroon"
  })

  // Contact Info State
  const [contactInfo, setContactInfo] = useState<{ address: string; email: string; phone?: string }>({
    address: "Yaoundé, Cameroon",
    email: "info@ticsummit.org",
    phone: "+237 XXX XXX XXX"
  })

  // Mission/Vision/Values State
  const [mvv, setMvv] = useState<{ mission: string; vision: string; values: string; introText?: string }>({
    mission: "Empower young innovators through technology, mentorship, and hands-on learning experiences.",
    vision: "Create a thriving ecosystem where young minds can innovate and build the future of Cameroon.",
    values: "Innovation, collaboration, excellence, and impact drive everything we do.",
    introText: "The summit provides a platform for these brilliant minds to connect with industry experts, gain valuable mentorship, and win prizes for their innovative ideas. We believe that every young person has the potential to change the world through technology."
  })

  // Modal States
  const [showFounderModal, setShowFounderModal] = useState(false)
  const [showHeroCarouselModal, setShowHeroCarouselModal] = useState(false)
  const [showStudentsCarouselModal, setShowStudentsCarouselModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [showPartnersModal, setShowPartnersModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showFeaturesModal, setShowFeaturesModal] = useState(false)
  const [showTICImpactModal, setShowTICImpactModal] = useState(false)
  const [showContactInfoModal, setShowContactInfoModal] = useState(false)
  const [showMVVModal, setShowMVVModal] = useState(false)
  const [editingCarouselSlide, setEditingCarouselSlide] = useState<{ type: "HERO" | "STUDENTS", slide: CarouselSlide | null, index: number } | null>(null)
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch founder quote
      const quoteRes = await fetch("/api/content/founder-quote")
      if (quoteRes.ok) {
        const quoteData = await quoteRes.json()
        if (quoteData.success && quoteData.data) {
          setFounderQuote(quoteData.data)
        }
      }

      // Fetch carousels
      const carouselRes = await fetch("/api/content/carousels")
      if (carouselRes.ok) {
        const carouselData = await carouselRes.json()
        if (carouselData.success) {
          const hero = carouselData.data.filter((c: any) => c.type === "HERO").sort((a: any, b: any) => a.order - b.order)
          const students = carouselData.data.filter((c: any) => c.type === "STUDENTS").sort((a: any, b: any) => a.order - b.order)
          setHeroCarousel(hero)
          setStudentsCarousel(students)
        }
      }

      // Fetch team members
      const teamRes = await fetch("/api/content/team-members")
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        if (teamData.success) {
          setTeamMembers(teamData.data.sort((a: any, b: any) => a.order - b.order))
        }
      }

      // Fetch site stats
      const statsRes = await fetch("/api/content/site-stats")
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        if (statsData.success && statsData.data) {
          setSiteStats(statsData.data)
        }
      }

      // Fetch site features
      const featuresRes = await fetch("/api/content/site-features")
      if (featuresRes.ok) {
        const featuresData = await featuresRes.json()
        if (featuresData.success) {
          const sorted = featuresData.data.sort((a: any, b: any) => a.order - b.order)
          if (sorted.length > 0) {
            setSiteFeatures(sorted)
          }
        }
      }

      // Fetch TIC Impact
      const impactRes = await fetch("/api/content/tic-impact")
      if (impactRes.ok) {
        const impactData = await impactRes.json()
        if (impactData.success && impactData.data) {
          setTicImpact(impactData.data)
        }
      }

      // Fetch FAQs
      const faqRes = await fetch("/api/content/faq")
      if (faqRes.ok) {
        const faqData = await faqRes.json()
        if (faqData.success) {
          setFaqs(faqData.data.sort((a: any, b: any) => a.order - b.order))
        }
      }

      // Fetch Partners
      const partnersRes = await fetch("/api/content/partners")
      if (partnersRes.ok) {
        const partnersData = await partnersRes.json()
        if (partnersData.success) {
          setPartners(partnersData.data.sort((a: any, b: any) => a.order - b.order))
        }
      }

      // Fetch Contact Info
      const contactRes = await fetch("/api/content/contact-info")
      if (contactRes.ok) {
        const contactData = await contactRes.json()
        if (contactData.success && contactData.data) {
          setContactInfo(contactData.data)
        }
      }

      // Fetch Mission/Vision/Values
      const mvvRes = await fetch("/api/content/mission-vision-values")
      if (mvvRes.ok) {
        const mvvData = await mvvRes.json()
        if (mvvData.success && mvvData.data) {
          setMvv(mvvData.data)
        }
      }

    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load content")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFounderQuote = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/founder-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(founderQuote)
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Founder quote updated successfully")
        setShowFounderModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update founder quote")
      }
    } catch (error) {
      console.error("Error saving founder quote:", error)
      toast.error("Failed to save founder quote")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCarousel = async (type: "HERO" | "STUDENTS", slides: CarouselSlide[]) => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/carousels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slides })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(`${type === "HERO" ? "Hero" : "Students"} carousel updated successfully`)
        setShowHeroCarouselModal(false)
        setShowStudentsCarouselModal(false)
        setEditingCarouselSlide(null)
        await fetchData()
      } else {
        toast.error("Failed to update carousel")
      }
    } catch (error) {
      console.error("Error saving carousel:", error)
      toast.error("Failed to save carousel")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTeamMembers = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/team-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: teamMembers })
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Team members updated successfully")
        setShowTeamModal(false)
        setEditingTeamMember(null)
        await fetchData()
      } else {
        toast.error("Failed to update team members")
      }
    } catch (error) {
      console.error("Error saving team members:", error)
      toast.error("Failed to save team members")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFAQs = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs })
      })

      const data = await response.json()
      if (data.success) {
        toast.success("FAQs updated successfully")
        setShowFAQModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update FAQs")
      }
    } catch (error) {
      console.error("Error saving FAQs:", error)
      toast.error("Failed to save FAQs")
    } finally {
      setSaving(false)
    }
  }

  const handleSavePartners = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partners })
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Partners updated successfully")
        setShowPartnersModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update partners")
      }
    } catch (error) {
      console.error("Error saving partners:", error)
      toast.error("Failed to save partners")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveStats = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/site-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteStats)
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Stats updated successfully")
        setShowStatsModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update stats")
      }
    } catch (error) {
      console.error("Error saving stats:", error)
      toast.error("Failed to save stats")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFeatures = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/site-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: siteFeatures })
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Features updated successfully")
        setShowFeaturesModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update features")
      }
    } catch (error) {
      console.error("Error saving features:", error)
      toast.error("Failed to save features")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTICImpact = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/tic-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticImpact)
      })

      const data = await response.json()
      if (data.success) {
        toast.success("TIC Impact updated successfully")
        setShowTICImpactModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update TIC Impact")
      }
    } catch (error) {
      console.error("Error saving TIC Impact:", error)
      toast.error("Failed to save TIC Impact")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveContactInfo = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/contact-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo)
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Contact info updated successfully")
        setShowContactInfoModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update contact info")
      }
    } catch (error) {
      console.error("Error saving contact info:", error)
      toast.error("Failed to save contact info")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveMVV = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/mission-vision-values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mvv)
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Mission/Vision/Values updated successfully")
        setShowMVVModal(false)
        await fetchData()
      } else {
        toast.error("Failed to update Mission/Vision/Values")
      }
    } catch (error) {
      console.error("Error saving Mission/Vision/Values:", error)
      toast.error("Failed to save Mission/Vision/Values")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 relative pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Minor Updates</h1>
            <p className="text-gray-600 mt-1">Manage content sections</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Founder Quote Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowFounderModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Founder Quote</h3>
                  <p className="text-sm text-gray-600">Manage founder message</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 line-clamp-2">{founderQuote.quote}</p>
              </div>
            </motion.div>

            {/* Hero Carousel Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowHeroCarouselModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Hero Carousel</h3>
                  <p className="text-sm text-gray-600">{heroCarousel.length} slides</p>
                </div>
              </div>
            </motion.div>

            {/* Students Carousel Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowStudentsCarouselModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Students Carousel</h3>
                  <p className="text-sm text-gray-600">{studentsCarousel.length} slides</p>
                </div>
              </div>
            </motion.div>

            {/* Team Members Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowTeamModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                  <p className="text-sm text-gray-600">{teamMembers.length} members</p>
                </div>
              </div>
            </motion.div>

            {/* FAQ Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowFAQModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
                  <p className="text-sm text-gray-600">{faqs.length} questions</p>
                </div>
              </div>
            </motion.div>

            {/* Partners Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowPartnersModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Partners</h3>
                  <p className="text-sm text-gray-600">{partners.length} partners</p>
                </div>
              </div>
            </motion.div>

            {/* Site Stats Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowStatsModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Site Stats</h3>
                  <p className="text-sm text-gray-600">Manage statistics</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium text-gray-900">{siteStats.studentsReached.toLocaleString()}+</span>
                  <span className="text-gray-600 ml-1">Students</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{siteStats.schoolsVisited}</span>
                  <span className="text-gray-600 ml-1">Schools</span>
                </div>
              </div>
            </motion.div>

            {/* Site Features Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowFeaturesModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Site Features</h3>
                  <p className="text-sm text-gray-600">{siteFeatures.length} features</p>
                </div>
              </div>
            </motion.div>

            {/* TIC Impact Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowTICImpactModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">TIC Impact</h3>
                  <p className="text-sm text-gray-600">Manage impact statistics</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium text-gray-900">{ticImpact.studentsInspired.toLocaleString()}+</span>
                  <span className="text-gray-600 ml-1">Students</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{ticImpact.teenagersTrained.toLocaleString()}+</span>
                  <span className="text-gray-600 ml-1">Teenagers</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Info Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowContactInfoModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact Info</h3>
                  <p className="text-sm text-gray-600">Manage footer contact</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 line-clamp-1">{contactInfo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 line-clamp-1">{contactInfo.email}</span>
                </div>
                {contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 line-clamp-1">{contactInfo.phone}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Mission/Vision/Values Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              onClick={() => setShowMVVModal(true)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Mission/Vision/Values</h3>
                  <p className="text-sm text-gray-600">Manage about page content</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
                <div className="text-gray-600 line-clamp-1">
                  <strong>Mission:</strong> {mvv.mission.substring(0, 50)}...
                </div>
                <div className="text-gray-600 line-clamp-1">
                  <strong>Vision:</strong> {mvv.vision.substring(0, 50)}...
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Founder Quote Modal */}
        <FounderQuoteModal
          isOpen={showFounderModal}
          onClose={() => setShowFounderModal(false)}
          founderQuote={founderQuote}
          setFounderQuote={setFounderQuote}
          onSave={handleSaveFounderQuote}
          saving={saving}
        />

        {/* Hero Carousel Modal */}
        <CarouselModal
          isOpen={showHeroCarouselModal}
          onClose={() => setShowHeroCarouselModal(false)}
          type="HERO"
          slides={heroCarousel}
          setSlides={setHeroCarousel}
          onSave={(slides) => handleSaveCarousel("HERO", slides)}
          saving={saving}
        />

        {/* Students Carousel Modal */}
        <CarouselModal
          isOpen={showStudentsCarouselModal}
          onClose={() => setShowStudentsCarouselModal(false)}
          type="STUDENTS"
          slides={studentsCarousel}
          setSlides={setStudentsCarousel}
          onSave={(slides) => handleSaveCarousel("STUDENTS", slides)}
          saving={saving}
        />

        {/* Team Members Modal */}
        <TeamMembersModal
          isOpen={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          onSave={handleSaveTeamMembers}
          saving={saving}
        />

        {/* FAQ Modal */}
        <FAQModal
          isOpen={showFAQModal}
          onClose={() => setShowFAQModal(false)}
          faqs={faqs}
          setFaqs={setFaqs}
          onSave={handleSaveFAQs}
          saving={saving}
        />

        {/* Partners Modal */}
        <PartnersModal
          isOpen={showPartnersModal}
          onClose={() => setShowPartnersModal(false)}
          partners={partners}
          setPartners={setPartners}
          onSave={handleSavePartners}
          saving={saving}
        />

        {/* Site Stats Modal */}
        <SiteStatsModal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          stats={siteStats}
          setStats={setSiteStats}
          onSave={handleSaveStats}
          saving={saving}
        />

        {/* Site Features Modal */}
        <SiteFeaturesModal
          isOpen={showFeaturesModal}
          onClose={() => setShowFeaturesModal(false)}
          features={siteFeatures}
          setFeatures={(features) => setSiteFeatures(features)}
          onSave={handleSaveFeatures}
          saving={saving}
        />

        {/* TIC Impact Modal */}
        <TICImpactModal
          isOpen={showTICImpactModal}
          onClose={() => setShowTICImpactModal(false)}
          impact={ticImpact}
          setImpact={(impact) => setTicImpact(impact)}
          onSave={handleSaveTICImpact}
          saving={saving}
        />

        {/* Contact Info Modal */}
        <ContactInfoModal
          isOpen={showContactInfoModal}
          onClose={() => setShowContactInfoModal(false)}
          contactInfo={contactInfo}
          setContactInfo={(info) => setContactInfo(info)}
          onSave={handleSaveContactInfo}
          saving={saving}
        />

        {/* Mission/Vision/Values Modal */}
        <MVVModal
          isOpen={showMVVModal}
          onClose={() => setShowMVVModal(false)}
          mvv={mvv}
          setMvv={(mvv) => setMvv(mvv)}
          onSave={handleSaveMVV}
          saving={saving}
        />
      </div>
    </Layout>
  )
}

// Founder Quote Modal Component
const FounderQuoteModal = ({ 
  isOpen, 
  onClose, 
  founderQuote, 
  setFounderQuote, 
  onSave, 
  saving 
}: {
  isOpen: boolean
  onClose: () => void
  founderQuote: FounderQuote
  setFounderQuote: (quote: FounderQuote) => void
  onSave: () => void
  saving: boolean
}) => {
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        setFounderQuote({ ...founderQuote, imageUrl: res[0].url })
        setUploadingImage(false)
        toast.success("Image uploaded successfully")
      }
    },
    onUploadError: () => {
      setUploadingImage(false)
      toast.error("Failed to upload image")
    },
  })

  const handleImageUpload = useCallback((file: File) => {
    setUploadingImage(true)
    startUpload([file])
  }, [startUpload])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Founder Quote</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="flex items-center gap-4">
                  {founderQuote.imageUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                      <img src={founderQuote.imageUrl} alt={founderQuote.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                    <ImageIcon className="h-4 w-4 inline mr-1" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage || saving}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Letter</label>
                  <input
                    type="text"
                    value={founderQuote.initial}
                    onChange={(e) => setFounderQuote({...founderQuote, initial: e.target.value})}
                    maxLength={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={founderQuote.name}
                    onChange={(e) => setFounderQuote({...founderQuote, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={founderQuote.title}
                  onChange={(e) => setFounderQuote({...founderQuote, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                <textarea
                  rows={4}
                  value={founderQuote.quote}
                  onChange={(e) => setFounderQuote({...founderQuote, quote: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving || uploadingImage}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Carousel Modal Component
const CarouselModal = ({
  isOpen,
  onClose,
  type,
  slides,
  setSlides,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  type: "HERO" | "STUDENTS"
  slides: CarouselSlide[]
  setSlides: (slides: CarouselSlide[]) => void
  onSave: (slides: CarouselSlide[]) => void
  saving: boolean
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddSlide = () => {
    const newSlide: CarouselSlide = {
      imageUrl: "",
      title: "",
      subtitle: "",
      description: "",
      category: "",
      order: slides.length,
      active: true
    }
    setSlides([...slides, newSlide])
    setEditingIndex(slides.length)
  }

  const handleDeleteSlide = async (index: number, slideId?: string) => {
    if (slideId && slideId !== "new") {
      try {
        const response = await fetch(`/api/content/carousels/${slideId}`, { method: "DELETE" })
        const data = await response.json()
        if (!data.success) {
          toast.error("Failed to delete slide")
          return
        }
      } catch (error) {
        toast.error("Failed to delete slide")
        return
      }
    }
    
    const updated = slides.filter((_, i) => i !== index)
    updated.forEach((slide, i) => { slide.order = i })
    setSlides(updated)
    setEditingIndex(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{type === "HERO" ? "Hero" : "Students"} Carousel</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddSlide}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <CarouselSlideEditor
                    key={slide.id || index}
                    slide={slide}
                    index={index}
                    type={type}
                    isEditing={editingIndex === index}
                    onEdit={() => setEditingIndex(index)}
                    onCancel={() => setEditingIndex(null)}
                    onChange={(updated) => {
                      const newSlides = [...slides]
                      newSlides[index] = updated
                      setSlides(newSlides)
                    }}
                    onDelete={() => handleDeleteSlide(index, slide.id)}
                    onMove={(direction) => {
                      const newSlides = [...slides]
                      const newIndex = direction === "up" ? index - 1 : index + 1
                      if (newIndex < 0 || newIndex >= newSlides.length) return
                      const temp = newSlides[index]
                      newSlides[index] = newSlides[newIndex]
                      newSlides[newIndex] = temp
                      newSlides[index].order = index
                      newSlides[newIndex].order = newIndex
                      setSlides(newSlides)
                    }}
                  />
                ))}
              </div>

              {slides.length > 0 && (
                <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onSave(slides)}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Carousel Slide Editor Component
const CarouselSlideEditor = ({
  slide,
  index,
  type,
  isEditing,
  onEdit,
  onCancel,
  onChange,
  onDelete,
  onMove
}: {
  slide: CarouselSlide
  index: number
  type: "HERO" | "STUDENTS"
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onChange: (slide: CarouselSlide) => void
  onDelete: () => void
  onMove: (direction: "up" | "down") => void
}) => {
  const [uploading, setUploading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(slide)
  
  // Update local slide state when prop changes
  useEffect(() => {
    setCurrentSlide(slide)
  }, [slide])
  
  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        const updated = { ...currentSlide, imageUrl: res[0].url }
        setCurrentSlide(updated)
        onChange(updated)
        setUploading(false)
        toast.success("Image uploaded successfully")
      } else {
        setUploading(false)
        toast.error("Upload completed but no URL received")
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error)
      setUploading(false)
      toast.error("Failed to upload image")
    },
  })

  const handleImageUpload = (file: File) => {
    setUploading(true)
    startUpload([file])
  }

  if (!isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{slide.title || "Untitled Slide"}</h4>
            <p className="text-sm text-gray-600">{slide.subtitle || slide.description || "No description"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove("up")} disabled={index === 0} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove("down")} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
            {currentSlide.imageUrl ? (
              <img src={currentSlide.imageUrl} alt={currentSlide.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <label className="mt-2 block px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 text-center cursor-pointer">
            {uploading ? "Uploading..." : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
            />
          </label>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={currentSlide.imageUrl}
              onChange={(e) => {
                const updated = { ...currentSlide, imageUrl: e.target.value }
                setCurrentSlide(updated)
                onChange(updated)
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
              placeholder="Image URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => {
                const updated = { ...currentSlide, title: e.target.value }
                setCurrentSlide(updated)
                onChange(updated)
              }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
              />
            </div>
            {type === "HERO" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={currentSlide.subtitle || ""}
                  onChange={(e) => {
                const updated = { ...currentSlide, subtitle: e.target.value }
                setCurrentSlide(updated)
                onChange(updated)
              }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={currentSlide.category || ""}
                  onChange={(e) => {
                const updated = { ...currentSlide, category: e.target.value }
                setCurrentSlide(updated)
                onChange(updated)
              }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={currentSlide.description || ""}
              onChange={(e) => {
                const updated = { ...currentSlide, description: e.target.value }
                setCurrentSlide(updated)
                onChange(updated)
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Team Members Modal Component
const TeamMembersModal = ({
  isOpen,
  onClose,
  teamMembers,
  setTeamMembers,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  teamMembers: TeamMember[]
  setTeamMembers: (members: TeamMember[]) => void
  onSave: () => void
  saving: boolean
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddMember = () => {
    const newMember: TeamMember = {
      name: "",
      slug: "",
      role: "",
      bio: "",
      order: teamMembers.length,
      active: true
    }
    setTeamMembers([...teamMembers, newMember])
    setEditingIndex(teamMembers.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <TeamMemberEditor
                    key={member.id || index}
                    member={member}
                    index={index}
                    isEditing={editingIndex === index}
                    onEdit={() => setEditingIndex(index)}
                    onCancel={() => setEditingIndex(null)}
                    onChange={(updated) => {
                      const newMembers = [...teamMembers]
                      newMembers[index] = updated
                      setTeamMembers(newMembers)
                    }}
                    onDelete={() => {
                      const updated = teamMembers.filter((_, i) => i !== index)
                      updated.forEach((m, i) => { m.order = i })
                      setTeamMembers(updated)
                      setEditingIndex(null)
                    }}
                    onMove={(direction) => {
                      const newMembers = [...teamMembers]
                      const newIndex = direction === "up" ? index - 1 : index + 1
                      if (newIndex < 0 || newIndex >= newMembers.length) return
                      const temp = newMembers[index]
                      newMembers[index] = newMembers[newIndex]
                      newMembers[newIndex] = temp
                      newMembers[index].order = index
                      newMembers[newIndex].order = newIndex
                      setTeamMembers(newMembers)
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Team Member Editor Component
const TeamMemberEditor = ({
  member,
  index,
  isEditing,
  onEdit,
  onCancel,
  onChange,
  onDelete,
  onMove
}: {
  member: TeamMember
  index: number
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onChange: (member: TeamMember) => void
  onDelete: () => void
  onMove: (direction: "up" | "down") => void
}) => {
  const [uploading, setUploading] = useState(false)
  const [currentMember, setCurrentMember] = useState(member)
  
  // Update local member state when prop changes
  useEffect(() => {
    setCurrentMember(member)
  }, [member])
  
  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        const updated = { ...currentMember, imageUrl: res[0].url }
        setCurrentMember(updated)
        onChange(updated)
        setUploading(false)
        toast.success("Image uploaded successfully")
      } else {
        setUploading(false)
        toast.error("Upload completed but no URL received")
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error)
      setUploading(false)
      toast.error("Failed to upload image")
    },
  })

  if (!isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            {currentMember.imageUrl ? (
              <img src={currentMember.imageUrl} alt={currentMember.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{currentMember.name || "Untitled"}</h4>
            <p className="text-sm text-gray-600">{currentMember.role || "No role"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove("up")} disabled={index === 0} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove("down")} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden">
            {currentMember.imageUrl ? (
              <img src={currentMember.imageUrl} alt={currentMember.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <label className="mt-2 block px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 text-center cursor-pointer">
            {uploading ? "Uploading..." : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setUploading(true)
                  startUpload([file])
                }
              }}
            />
          </label>
        </div>

        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={currentMember.name}
                onChange={(e) => {
                  const name = e.target.value
                  const slug = name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
                  const updated = { ...currentMember, name, slug: slug || currentMember.slug }
                  setCurrentMember(updated)
                  onChange(updated)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={currentMember.role}
                onChange={(e) => {
                  const updated = { ...currentMember, role: e.target.value }
                  setCurrentMember(updated)
                  onChange(updated)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly)</label>
            <input
              type="text"
              value={currentMember.slug || ""}
              onChange={(e) => {
                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').trim()
                const updated = { ...currentMember, slug }
                setCurrentMember(updated)
                onChange(updated)
              }}
              placeholder="john-doe"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Used in URL: /team/[slug]</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={2}
              value={currentMember.bio || ""}
              onChange={(e) => {
                const updated = { ...currentMember, bio: e.target.value }
                setCurrentMember(updated)
                onChange(updated)
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={currentMember.email || ""}
                onChange={(e) => {
                  const updated = { ...currentMember, email: e.target.value }
                  setCurrentMember(updated)
                  onChange(updated)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={currentMember.linkedin || ""}
                onChange={(e) => {
                  const updated = { ...currentMember, linkedin: e.target.value }
                  setCurrentMember(updated)
                  onChange(updated)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <input
                type="url"
                value={currentMember.twitter || ""}
                onChange={(e) => {
                  const updated = { ...currentMember, twitter: e.target.value }
                  setCurrentMember(updated)
                  onChange(updated)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Site Stats Modal Component
const SiteStatsModal = ({
  isOpen,
  onClose,
  stats,
  setStats,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  stats: { studentsReached: number, schoolsVisited: number, successfulProjects: number, daysOfInnovation: number }
  setStats: (stats: { studentsReached: number, schoolsVisited: number, successfulProjects: number, daysOfInnovation: number }) => void
  onSave: () => void
  saving: boolean
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Site Stats</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Students Reached</label>
                  <input
                    type="number"
                    value={stats.studentsReached}
                    onChange={(e) => setStats({ ...stats, studentsReached: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schools Visited</label>
                  <input
                    type="number"
                    value={stats.schoolsVisited}
                    onChange={(e) => setStats({ ...stats, schoolsVisited: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Successful Projects</label>
                  <input
                    type="number"
                    value={stats.successfulProjects}
                    onChange={(e) => setStats({ ...stats, successfulProjects: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days of Innovation</label>
                  <input
                    type="number"
                    value={stats.daysOfInnovation}
                    onChange={(e) => setStats({ ...stats, daysOfInnovation: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Site Features Modal Component
const SiteFeaturesModal = ({
  isOpen,
  onClose,
  features,
  setFeatures,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  features: Array<{ id: string, title: string, description: string, iconName?: string, color?: string, order: number, active: boolean, introText?: string }>
  setFeatures: (features: Array<{ id: string, title: string, description: string, iconName?: string, color?: string, order: number, active: boolean, introText?: string }>) => void
  onSave: () => void
  saving: boolean
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const iconOptions = ["Target", "Lightbulb", "Users", "Award", "Heart", "Globe", "Trophy", "Star"]
  const colorOptions = ["bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-indigo-500", "bg-pink-500", "bg-orange-500"]

  const handleAddFeature = () => {
    const newFeature = {
      id: "",
      title: "",
      description: "",
      iconName: "Target",
      color: "bg-blue-500",
      order: features.length,
      active: true
    }
    setFeatures([...features, newFeature])
    setEditingIndex(features.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Site Features</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={feature.id || index} className="border border-gray-200 rounded-lg p-4">
                    {editingIndex === index ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => {
                              const updated = [...features]
                              updated[index] = { ...updated[index], title: e.target.value }
                              setFeatures(updated)
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={feature.description}
                            onChange={(e) => {
                              const updated = [...features]
                              updated[index] = { ...updated[index], description: e.target.value }
                              setFeatures(updated)
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                            <select
                              value={feature.iconName || ""}
                              onChange={(e) => {
                                const updated = [...features]
                                updated[index] = { ...updated[index], iconName: e.target.value }
                                setFeatures(updated)
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                            >
                              {iconOptions.map(icon => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <select
                              value={feature.color || ""}
                              onChange={(e) => {
                                const updated = [...features]
                                updated[index] = { ...updated[index], color: e.target.value }
                                setFeatures(updated)
                              }}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                            >
                              {colorOptions.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${feature.color || "bg-gray-500"} rounded-lg flex items-center justify-center`}>
                            {(() => {
                              const iconMap: Record<string, any> = { Target, Lightbulb, Users, Award, Heart, Globe, Trophy, Star }
                              const Icon = iconMap[feature.iconName || "Target"] || Target
                              return <Icon className="w-6 h-6 text-white" />
                            })()}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{feature.title || "Untitled"}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{feature.description || "No description"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingIndex(index)}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const updated = features.filter((_, i) => i !== index)
                              updated.forEach((f, i) => { f.order = i })
                              setFeatures(updated)
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// TIC Impact Modal Component
const TICImpactModal = ({
  isOpen,
  onClose,
  impact,
  setImpact,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  impact: { studentsInspired: number, teenagersTrained: number, prizeAwardsFCFA: number, ticClubsEstablished: number, subtitle?: string, description?: string }
  setImpact: (impact: { studentsInspired: number, teenagersTrained: number, prizeAwardsFCFA: number, ticClubsEstablished: number, subtitle?: string, description?: string }) => void
  onSave: () => void
  saving: boolean
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit TIC Impact</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={impact.subtitle || ""}
                  onChange={(e) => setImpact({ ...impact, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  placeholder="e.g., in 4 Years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={2}
                  value={impact.description || ""}
                  onChange={(e) => setImpact({ ...impact, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
                  placeholder="e.g., Transforming lives and building the future of tech in Cameroon"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Students Inspired</label>
                  <input
                    type="number"
                    value={impact.studentsInspired}
                    onChange={(e) => setImpact({ ...impact, studentsInspired: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teenagers Trained</label>
                  <input
                    type="number"
                    value={impact.teenagersTrained}
                    onChange={(e) => setImpact({ ...impact, teenagersTrained: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prize Awards (M FCFA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={impact.prizeAwardsFCFA}
                    onChange={(e) => setImpact({ ...impact, prizeAwardsFCFA: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">TIC Clubs Established</label>
                  <input
                    type="number"
                    value={impact.ticClubsEstablished}
                    onChange={(e) => setImpact({ ...impact, ticClubsEstablished: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// FAQ Modal Component
const FAQModal = ({
  isOpen,
  onClose,
  faqs,
  setFaqs,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  faqs: FAQ[]
  setFaqs: (faqs: FAQ[]) => void
  onSave: () => void
  saving: boolean
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddFAQ = () => {
    const newFAQ: FAQ = {
      question: "",
      answer: "",
      order: faqs.length,
      active: true
    }
    setFaqs([...faqs, newFAQ])
    setEditingIndex(faqs.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddFAQ}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FAQEditor
                    key={faq.id || index}
                    faq={faq}
                    index={index}
                    isEditing={editingIndex === index}
                    onEdit={() => setEditingIndex(index)}
                    onCancel={() => setEditingIndex(null)}
                    onChange={(updated) => {
                      const newFaqs = [...faqs]
                      newFaqs[index] = updated
                      setFaqs(newFaqs)
                    }}
                    onDelete={() => {
                      const updated = faqs.filter((_, i) => i !== index)
                      updated.forEach((f, i) => { f.order = i })
                      setFaqs(updated)
                      setEditingIndex(null)
                    }}
                    onMove={(direction) => {
                      const newFaqs = [...faqs]
                      const newIndex = direction === "up" ? index - 1 : index + 1
                      if (newIndex < 0 || newIndex >= newFaqs.length) return
                      const temp = newFaqs[index]
                      newFaqs[index] = newFaqs[newIndex]
                      newFaqs[newIndex] = temp
                      newFaqs[index].order = index
                      newFaqs[newIndex].order = newIndex
                      setFaqs(newFaqs)
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// FAQ Editor Component
const FAQEditor = ({
  faq,
  index,
  isEditing,
  onEdit,
  onCancel,
  onChange,
  onDelete,
  onMove
}: {
  faq: FAQ
  index: number
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onChange: (faq: FAQ) => void
  onDelete: () => void
  onMove: (direction: "up" | "down") => void
}) => {
  const [currentFAQ, setCurrentFAQ] = useState(faq)

  useEffect(() => {
    setCurrentFAQ(faq)
  }, [faq])

  if (!isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{currentFAQ.question || "Untitled Question"}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{currentFAQ.answer || "No answer"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove("up")} disabled={index === 0} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove("down")} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <input
          type="text"
          value={currentFAQ.question}
          onChange={(e) => {
            const updated = { ...currentFAQ, question: e.target.value }
            setCurrentFAQ(updated)
            onChange(updated)
          }}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
        <textarea
          rows={4}
          value={currentFAQ.answer}
          onChange={(e) => {
            const updated = { ...currentFAQ, answer: e.target.value }
            setCurrentFAQ(updated)
            onChange(updated)
          }}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={currentFAQ.active}
            onChange={(e) => {
              const updated = { ...currentFAQ, active: e.target.checked }
              setCurrentFAQ(updated)
              onChange(updated)
            }}
            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Partners Modal Component
const PartnersModal = ({
  isOpen,
  onClose,
  partners,
  setPartners,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  partners: Partner[]
  setPartners: (partners: Partner[]) => void
  onSave: () => void
  saving: boolean
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddPartner = () => {
    const newPartner: Partner = {
      name: "",
      logoUrl: "",
      order: partners.length,
      active: true
    }
    setPartners([...partners, newPartner])
    setEditingIndex(partners.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Partners</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddPartner}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Partner
                </button>
              </div>

              <div className="space-y-4">
                {partners.map((partner, index) => (
                  <PartnerEditor
                    key={partner.id || index}
                    partner={partner}
                    index={index}
                    isEditing={editingIndex === index}
                    onEdit={() => setEditingIndex(index)}
                    onCancel={() => setEditingIndex(null)}
                    onChange={(updated) => {
                      const newPartners = [...partners]
                      newPartners[index] = updated
                      setPartners(newPartners)
                    }}
                    onDelete={() => {
                      const updated = partners.filter((_, i) => i !== index)
                      updated.forEach((p, i) => { p.order = i })
                      setPartners(updated)
                      setEditingIndex(null)
                    }}
                    onMove={(direction) => {
                      const newPartners = [...partners]
                      const newIndex = direction === "up" ? index - 1 : index + 1
                      if (newIndex < 0 || newIndex >= newPartners.length) return
                      const temp = newPartners[index]
                      newPartners[index] = newPartners[newIndex]
                      newPartners[newIndex] = temp
                      newPartners[index].order = index
                      newPartners[newIndex].order = newIndex
                      setPartners(newPartners)
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Partner Editor Component
const PartnerEditor = ({
  partner,
  index,
  isEditing,
  onEdit,
  onCancel,
  onChange,
  onDelete,
  onMove
}: {
  partner: Partner
  index: number
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onChange: (partner: Partner) => void
  onDelete: () => void
  onMove: (direction: "up" | "down") => void
}) => {
  const [uploading, setUploading] = useState(false)
  const [currentPartner, setCurrentPartner] = useState(partner)

  useEffect(() => {
    setCurrentPartner(partner)
  }, [partner])

  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        const updated = { ...currentPartner, logoUrl: res[0].url }
        setCurrentPartner(updated)
        onChange(updated)
        setUploading(false)
        toast.success("Logo uploaded successfully")
      } else {
        setUploading(false)
        toast.error("Upload completed but no URL received")
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error)
      setUploading(false)
      toast.error("Failed to upload logo")
    },
  })

  if (!isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {currentPartner.logoUrl ? (
              <img src={currentPartner.logoUrl} alt={currentPartner.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{currentPartner.name || "Untitled Partner"}</h4>
            {currentPartner.website && (
              <p className="text-sm text-gray-600">{currentPartner.website}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove("up")} disabled={index === 0} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => onMove("down")} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            {currentPartner.logoUrl ? (
              <img src={currentPartner.logoUrl} alt={currentPartner.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <label className="mt-2 block px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 text-center cursor-pointer">
            {uploading ? "Uploading..." : "Upload Logo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setUploading(true)
                  startUpload([file])
                }
              }}
            />
          </label>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input
              type="text"
              value={currentPartner.name}
              onChange={(e) => {
                const updated = { ...currentPartner, name: e.target.value }
                setCurrentPartner(updated)
                onChange(updated)
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (Optional)</label>
            <input
              type="url"
              value={currentPartner.website || ""}
              onChange={(e) => {
                const updated = { ...currentPartner, website: e.target.value }
                setCurrentPartner(updated)
                onChange(updated)
              }}
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentPartner.active}
                onChange={(e) => {
                  const updated = { ...currentPartner, active: e.target.checked }
                  setCurrentPartner(updated)
                  onChange(updated)
                }}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <button onClick={onCancel} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Contact Info Modal Component
const ContactInfoModal = ({
  isOpen,
  onClose,
  contactInfo,
  setContactInfo,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  contactInfo: { address: string; email: string; phone?: string }
  setContactInfo: (info: { address: string; email: string; phone?: string }) => void
  onSave: () => void
  saving: boolean
}) => {
  const [currentInfo, setCurrentInfo] = useState(contactInfo)

  useEffect(() => {
    setCurrentInfo(contactInfo)
  }, [contactInfo])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={currentInfo.address}
                  onChange={(e) => {
                    const updated = { ...currentInfo, address: e.target.value }
                    setCurrentInfo(updated)
                    setContactInfo(updated)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  placeholder="Yaoundé, Cameroon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={currentInfo.email}
                  onChange={(e) => {
                    const updated = { ...currentInfo, email: e.target.value }
                    setCurrentInfo(updated)
                    setContactInfo(updated)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  placeholder="info@ticsummit.org"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  type="text"
                  value={currentInfo.phone || ""}
                  onChange={(e) => {
                    const updated = { ...currentInfo, phone: e.target.value }
                    setCurrentInfo(updated)
                    setContactInfo(updated)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
                  placeholder="+237 XXX XXX XXX"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Mission/Vision/Values Modal Component
const MVVModal = ({
  isOpen,
  onClose,
  mvv,
  setMvv,
  onSave,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  mvv: { mission: string; vision: string; values: string; introText?: string }
  setMvv: (mvv: { mission: string; vision: string; values: string; introText?: string }) => void
  onSave: () => void
  saving: boolean
}) => {
  const [currentMVV, setCurrentMVV] = useState(mvv)

  useEffect(() => {
    setCurrentMVV(mvv)
  }, [mvv])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mission/Vision/Values</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intro Text (Optional)</label>
                <textarea
                  rows={3}
                  value={currentMVV.introText || ""}
                  onChange={(e) => {
                    const updated = { ...currentMVV, introText: e.target.value }
                    setCurrentMVV(updated)
                    setMvv(updated)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
                  placeholder="The summit provides a platform for..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                <textarea
                  rows={3}
                  value={currentMVV.mission}
                  onChange={(e) => {
                    const updated = { ...currentMVV, mission: e.target.value }
                    setCurrentMVV(updated)
                    setMvv(updated)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Empower young innovators through..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
                <textarea
                  rows={3}
                  value={currentMVV.vision}
                  onChange={(e) => {
                    const updated = { ...currentMVV, vision: e.target.value }
                    setCurrentMVV(updated)
                    setMvv(updated)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Create a thriving ecosystem where..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Values</label>
                <textarea
                  rows={3}
                  value={currentMVV.values}
                  onChange={(e) => {
                    const updated = { ...currentMVV, values: e.target.value }
                    setCurrentMVV(updated)
                    setMvv(updated)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Innovation, collaboration, excellence..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MinorUpdatesPage
