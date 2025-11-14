"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Rocket, 
  Award, 
  Globe, 
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Mail,
  BookOpen,
  Sparkles,
  Shield,
  Trophy
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import { StructuredData } from "@/components/seo/StructuredData"
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo"
import Image from "next/image"
import { SuccessStoryCard } from "@/components/techgirls-mentorship/SuccessStoryCard"
import { SuccessStoryModal } from "@/components/techgirls-mentorship/SuccessStoryModal"

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

const TechGirlsMentorshipPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    school: "",
    currentGrade: "",
    phone: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successStories, setSuccessStories] = useState<any[]>([])
  const [allStories, setAllStories] = useState<any[]>([])
  const [storiesLoading, setStoriesLoading] = useState(true)

  // Animated stats
  const participantsCount = useCountUp(50, 2000)
  const successRateCount = useCountUp(85, 2000)
  const programsCount = useCountUp(3, 1500)

  useEffect(() => {
    participantsCount.setIsVisible(true)
    successRateCount.setIsVisible(true)
    programsCount.setIsVisible(true)
    fetchSuccessStories()
  }, [])

  const fetchSuccessStories = async () => {
    try {
      setStoriesLoading(true)
      // Fetch 3 random stories for display
      const response = await fetch("/api/techgirls-success-stories")
      const data = await response.json()
      
      if (data.success) {
        setSuccessStories(data.data)
      }
      
      // Fetch all active stories for modal navigation
      const allResponse = await fetch("/api/techgirls-success-stories?all=true")
      const allData = await allResponse.json()
      
      if (allData.success) {
        setAllStories(allData.data)
      }
    } catch (error) {
      console.error("Error fetching success stories:", error)
    } finally {
      setStoriesLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/techgirls-applicants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setFormData({
          name: "",
          email: "",
          age: "",
          school: "",
          currentGrade: "",
          phone: "",
          message: ""
        })
      } else {
        alert(data.error || "Failed to submit application. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: Rocket,
      title: "Explore Tech Opportunities",
      description: "Discover exciting career paths and opportunities in technology"
    },
    {
      icon: GraduationCap,
      title: "Academic Growth",
      description: "Build strong academic foundations and enhance your learning"
    },
    {
      icon: Award,
      title: "Leadership Development",
      description: "Develop essential leadership skills for future success"
    },
    {
      icon: Globe,
      title: "TechGirls Program Prep",
      description: "Get mentored to apply for the fully funded U.S. Department of State exchange program"
    }
  ]

  const openStoryModal = (index: number) => {
    // Find the index in allStories array
    const story = successStories[index]
    if (story) {
      const allIndex = allStories.findIndex(s => s.id === story.id)
      setSelectedStoryIndex(allIndex >= 0 ? allIndex : 0)
      setIsModalOpen(true)
    }
  }

  const closeStoryModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedStoryIndex(null), 300)
  }

  const nextStory = () => {
    if (selectedStoryIndex !== null && allStories.length > 0) {
      setSelectedStoryIndex((selectedStoryIndex + 1) % allStories.length)
    }
  }

  const prevStory = () => {
    if (selectedStoryIndex !== null && allStories.length > 0) {
      setSelectedStoryIndex((selectedStoryIndex - 1 + allStories.length) % allStories.length)
    }
  }

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  }

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
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  }

  // FAQ structured data
  const faqSchema = generateFAQSchema([
    {
      question: "What is the TechGirls Mentorship Program?",
      answer: "The TechGirls Mentorship Program is designed to help young girls aged 15-17 explore technological opportunities, build personal and academic growth, and develop strong leadership skills. Our goal is to mentor and prepare participants to apply for the TechGirls Program — a fully funded U.S. Department of State exchange program."
    },
    {
      question: "Who is eligible for the TechGirls Mentorship Program?",
      answer: "Girls aged 15-17 who are currently in Lower Sixth or below and passionate about technology are eligible to apply for the program."
    },
    {
      question: "What are the benefits of joining the TechGirls Mentorship Program?",
      answer: "Participants will explore tech opportunities, build academic growth, develop leadership skills, and receive mentorship to prepare for the fully funded U.S. Department of State TechGirls Program exchange opportunity."
    },
    {
      question: "How do I apply for the TechGirls Mentorship Program?",
      answer: "You can express your interest by filling out the application form on this page. The form requires your name, email, age, school, current grade, phone number, and a message explaining your interest."
    },
    {
      question: "What is the TechGirls Program?",
      answer: "The TechGirls Program is a fully funded U.S. Department of State exchange program that empowers girls globally with technology, leadership, and career-building skills."
    }
  ])

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ticsummit.org'}/` },
    { name: "TechGirls Mentorship", url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ticsummit.org'}/techgirls-mentorship` }
  ])

  return (
    <Layout>
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Modern Split Layout */}
        <section className="relative text-white overflow-hidden h-screen flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://g9kbtbs1bu.ufs.sh/f/woziFUfAWTFpvBgRkD4kI78mGR3cKDX5Wr2LT0BnM9ZUQCbH"
              alt="TechGirls Mentorship Program"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Dark Gradient Overlay - Reduced opacity for clearer image */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-800/65 to-gray-900/70" />
          </div>

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 z-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 text-center"
              >
                {/* Main Headline */}
                <h1 className="text-5xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                  Launch Your Tech-Driven Future Today
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
                  We empower young girls with market-relevant tech skills, unlocking new career opportunities and equipping you with the confidence and expertise needed to thrive in today's competitive tech industry.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                  <Button
                    size="xl"
                    className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white border-0 shadow-lg hover:shadow-xl transition-all group"
                    onClick={() => {
                      document.getElementById('interest-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Creative Grid */}
        <section className="py-20 bg-gray-50 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                What You'll Gain
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join our mentorship program and unlock your potential in technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 hover:border-gray-300"
                >
                  <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility Section - Creative Design */}
        <section id="program-details" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Eligibility Requirements
                </h2>
                <p className="text-xl text-gray-600">
                  Check if you meet the requirements to join our program
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 border-2 border-gray-200 shadow-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Girls aged 15-17",
                    "Currently in Lower Sixth or below",
                    "Passionate about technology",
                    "Eager to learn and grow",
                    "Committed to the program"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-900 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg font-medium text-gray-900">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gray-900 text-white relative">
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Success Stories
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Through this program, many girls have gotten the opportunity to go for the TechGirls Program, and many more will follow.
              </p>
            </div>

            {storiesLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-4 text-white/80">Loading success stories...</p>
              </div>
            ) : successStories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/80">No success stories available at the moment.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                  {successStories.map((story, index) => (
                    <SuccessStoryCard
                      key={story.id || index}
                      story={story}
                      index={index}
                      onClick={() => openStoryModal(index)}
                    />
                  ))}
                </div>

                {/* Success Story Modal */}
                <SuccessStoryModal
                  isOpen={isModalOpen}
                  stories={allStories}
                  selectedIndex={selectedStoryIndex}
                  onClose={closeStoryModal}
                  onNext={nextStory}
                  onPrev={prevStory}
                  onSelectStory={setSelectedStoryIndex}
                />
              </>
            )}
          </div>
        </section>

        {/* Interest Form Section - Creative Design */}
        <section id="interest-form" className="py-20 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6"
                >
                  <Mail className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  Express Your Interest
                </h2>
                <p className="text-xl text-gray-600">
                  👉 Join this program to express your interest and take the first step towards becoming a future leader in tech!
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-gray-200">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-16 h-16 text-gray-900 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-gray-700">
                      Thank you for your interest in the TechGirls Mentorship Program. We have received your application and will review it shortly. You will be contacted via email or whatsapp with further information.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: "name", label: "Full Name *", type: "text", placeholder: "Your full name", required: true },
                        { id: "email", label: "Email Address *", type: "email", placeholder: "your.email@example.com", required: true },
                        { id: "age", label: "Age *", type: "number", placeholder: "Enter your age", required: true },
                        { id: "phone", label: "Phone Number *", type: "tel", placeholder: "+237 XXX XXX XXX", required: true },
                        { id: "school", label: "School Name *", type: "text", placeholder: "Your school name", required: true },
                        { id: "currentGrade", label: "Current Grade *", type: "select", required: true, options: [ "Grade 10", "Grade 11", "Grade 12", "Other"] }
                      ].map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          {field.type === "select" ? (
                            <select
                              id={field.id}
                              required={field.required}
                              value={formData[field.id as keyof typeof formData]}
                              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                            >
                              <option value="" className="text-gray-400">Select grade</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              id={field.id}
                              required={field.required}
                              {...('min' in field && typeof field.min === 'number' ? { min: field.min } : {})}
                              {...('max' in field && typeof field.max === 'number' ? { max: field.max } : {})}
                              value={formData[field.id as keyof typeof formData]}
                              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400 text-gray-900"
                              placeholder={field.placeholder}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Why are you interested in this program? (Optional)
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400 resize-none text-gray-900"
                        placeholder="Tell us about your passion for technology and what you hope to gain from this program..."
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        size="xl"
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Mail className="mr-2 w-5 h-5 animate-spin" />
                            Opening Email...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 w-5 h-5" />
                            Express Interest
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default TechGirlsMentorshipPage
