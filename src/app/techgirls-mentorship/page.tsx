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
import { generateBreadcrumbSchema } from "@/lib/seo"
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

  // Animated stats
  const participantsCount = useCountUp(50, 2000)
  const successRateCount = useCountUp(85, 2000)
  const programsCount = useCountUp(3, 1500)

  useEffect(() => {
    participantsCount.setIsVisible(true)
    successRateCount.setIsVisible(true)
    programsCount.setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const subject = "TechGirls Mentorship Program - Interest Expression"
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Age: ${formData.age}
School: ${formData.school}
Current Grade: ${formData.currentGrade}
Phone: ${formData.phone}

Message:
${formData.message || "I'm interested in joining the TechGirls Mentorship Program!"}
    `.trim()
    
    const mailtoLink = `mailto:info@ticsummit.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
    
    setTimeout(() => {
      setIsSubmitting(false)
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
    }, 1000)
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

  const successStories = [
    {
      name: "Sarah M.",
      age: 17,
      school: "Bilingual Grammar School",
      achievement: "Selected for TechGirls Program 2024",
      quote: "The mentorship program prepared me perfectly for the TechGirls application process. I gained confidence and skills that helped me succeed.",
      icon: "🎓",
      fullStory: "Sarah joined the TechGirls Mentorship Program in 2023 with a passion for web development but limited experience. Through the program's structured mentorship and hands-on projects, she developed strong technical skills and leadership abilities. Her mentor helped her prepare a compelling application for the TechGirls Program, focusing on her unique perspective and growth journey. Sarah was selected as one of the program's success stories and is now pursuing Computer Science at university.",
      programYear: "2023-2024",
      currentStatus: "Studying Computer Science at University"
    },
    {
      name: "Amina K.",
      age: 16,
      school: "Sacred Heart College",
      achievement: "TechGirls Program Participant",
      quote: "I learned so much about technology and leadership. The program opened doors I never imagined possible.",
      icon: "💻",
      fullStory: "Amina discovered her interest in technology through the mentorship program's workshops and coding sessions. She participated in several team projects that built her confidence and technical expertise. The program's focus on leadership development helped her become a team leader in her school's tech club. Amina successfully applied to the TechGirls Program and was accepted, representing Cameroon in the international exchange program.",
      programYear: "2023-2024",
      currentStatus: "TechGirls Program Participant 2024"
    },
    {
      name: "Fatima B.",
      age: 17,
      school: "St. Joseph's College",
      achievement: "TechGirls Program Graduate",
      quote: "This program changed my life. I'm now studying Computer Science at university and pursuing my dreams in tech.",
      icon: "🚀",
      fullStory: "Fatima was one of the first participants in the TechGirls Mentorship Program. Starting with basic programming knowledge, she quickly advanced through the program's curriculum and mentorship sessions. Her dedication and the support from her mentor led to her acceptance into the TechGirls Program, where she excelled. After completing the program, Fatima returned to Cameroon with enhanced skills and a clear vision for her future. She's now studying Computer Science and mentoring other young girls interested in technology.",
      programYear: "2022-2023",
      currentStatus: "Computer Science Student & Mentor"
    }
  ]

  const openStoryModal = (index: number) => {
    setSelectedStoryIndex(index)
    setIsModalOpen(true)
  }

  const closeStoryModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedStoryIndex(null), 300)
  }

  const nextStory = () => {
    if (selectedStoryIndex !== null) {
      setSelectedStoryIndex((selectedStoryIndex + 1) % successStories.length)
    }
  }

  const prevStory = () => {
    if (selectedStoryIndex !== null) {
      setSelectedStoryIndex((selectedStoryIndex - 1 + successStories.length) % successStories.length)
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

  return (
    <Layout>
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "TechGirls Mentorship", url: "/techgirls-mentorship" }
      ])} />
      
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {successStories.map((story, index) => (
                <SuccessStoryCard
                  key={index}
                  story={story}
                  index={index}
                  onClick={() => openStoryModal(index)}
                />
              ))}
            </div>

            {/* Success Story Modal */}
            <SuccessStoryModal
              isOpen={isModalOpen}
              stories={successStories}
              selectedIndex={selectedStoryIndex}
              onClose={closeStoryModal}
              onNext={nextStory}
              onPrev={prevStory}
              onSelectStory={setSelectedStoryIndex}
            />
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
                      Thank You!
                    </h3>
                    <p className="text-gray-700">
                      Your email client should open shortly. Please send the email to express your interest!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: "name", label: "Full Name *", type: "text", placeholder: "Your full name", required: true },
                        { id: "email", label: "Email Address *", type: "email", placeholder: "your.email@example.com", required: true },
                        { id: "age", label: "Age *", type: "number", placeholder: "15-17", required: true, min: 15, max: 17 },
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
                              min={field.min}
                              max={field.max}
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
