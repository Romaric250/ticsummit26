"use client"

import { useState, useEffect } from "react"
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
  Calendar,
  MapPin,
  Trophy,
  Star,
  Quote,
  Play,
  ChevronRight,
  Sparkles,
  Zap,
  Rocket,
  Crown,
  Brain,
  Atom,
  Cpu,
  Database,
  Code,
  Layers,
  Shuffle,
  RotateCcw,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"

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
  // Animated counters
  const studentsCount = useCountUp(1000, 3000)
  const teenagersCount = useCountUp(5000, 3500)
  const prizeCount = useCountUp(2, 2000)
  const clubsCount = useCountUp(25, 2500)

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
      number: 1000,
      suffix: "+",
      label: "Students inspired to pursue tech careers",
      icon: Users,
      count: studentsCount
    },
    {
      number: 5000,
      suffix: "+",
      label: "Teenagers trained with technical skills",
      icon: Lightbulb,
      count: teenagersCount
    },
    {
      number: 2,
      suffix: "M FCFA",
      label: "In prize awards and scholarships",
      icon: Trophy,
      count: prizeCount
    },
    {
      number: 25,
      suffix: "+",
      label: "TIC clubs established across Cameroon",
      icon: Globe,
      count: clubsCount
    }
  ]

  const alumni = [
    {
      name: "Marie Nguema",
      role: "Software Engineer at Google",
      quote: "TIC Summit opened doors I never knew existed."
    },
    {
      name: "Jean Paul Mballa",
      role: "Founder of TechStart Cameroon",
      quote: "The mentorship I received changed my entire career path."
    },
    {
      name: "Sarah Mboumou",
      role: "Product Manager at Microsoft",
      quote: "TIC Summit taught me that innovation has no limits."
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
              
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                The summit provides a platform for these brilliant minds to connect with industry experts, gain valuable mentorship, and win prizes for their innovative ideas. We believe that every young person has the potential to change the world through technology.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600">Empower young innovators through technology, mentorship, and hands-on learning experiences.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600">Create a thriving ecosystem where young minds can innovate and build the future of Cameroon.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Values</h3>
                  <p className="text-gray-600">Innovation, collaboration, excellence, and impact drive everything we do.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-gray-50">
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
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                TIC's Impact
                <span className="block text-blue-900">in 4 Years</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Transforming lives and building the future of tech in Cameroon
              </p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {alumni.map((person, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center"
                >
                  <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {person.name.charAt(0)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {person.name}
                  </h3>
                  
                  <p className="text-blue-600 font-semibold mb-4">
                    {person.role}
                  </p>
                  
                  <blockquote className="text-gray-700 italic">
                    "{person.quote}"
                  </blockquote>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white group"
              >
                View All Alumni
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Founder's Message */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-white">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-3xl">P</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    Dr. Pierre Nkeng
                  </h3>
                  
                  <p className="text-blue-300 mb-6">
                    Founder & CEO, TIC Summit
                  </p>
                </div>
                
                <div className="text-center">
                  <Quote className="w-8 h-8 text-blue-300 mx-auto mb-6" />
                  
                  <blockquote className="text-lg leading-relaxed mb-8">
                    "When we started TIC Summit, we had a simple vision: to unlock the incredible potential of young minds across Cameroon. Today, seeing thousands of students transformed into innovators, entrepreneurs, and tech leaders, I know we've created something truly special."
                  </blockquote>
                  
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 group"
                  >
                    Read Full Story
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
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