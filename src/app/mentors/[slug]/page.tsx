"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft,
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  Award, 
  Heart,
  MessageCircle,
  Share2,
  Download,
  CheckCircle,
  Code,
  Palette,
  Camera,
  Music,
  BookOpen,
  Gamepad2,
  Mic,
  Video,
  Lightbulb,
  Target,
  Trophy,
  Gift,
  Globe,
  Coffee,
  Sparkles,
  Zap,
  Rocket,
  Crown,
  Brain,
  Atom,
  Cpu,
  Database,
  Layers,
  Shuffle,
  RotateCcw,
  Eye,
  EyeOff,
  Briefcase,
  Building,
  TrendingUp,
  Shield,
  GraduationCap,
  BookOpenCheck,
  FileText,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"

// Mock data - in real app, this would come from API/database
const mentorData = {
  "dr-patricia-tech-visionary": {
    id: "dr-patricia-tech-visionary",
    name: "Dr. Patricia Nguema",
    role: "Senior Tech Executive",
    location: "Douala",
    experience: "15+ years",
    specialties: ["Strategic Planning", "Tech Leadership", "Innovation Management"],
    bio: "Visionary leader with 15+ years transforming organizations through technology. Dr. Patricia mentors the next generation of tech leaders, sharing insights from building successful tech companies across Africa. Her expertise spans from startup strategy to enterprise transformation.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    badges: ["Tech Executive", "Innovation Leader", "Industry Pioneer"],
    stats: { mentees: 200, sessions: 150, rating: 4.9 },
    interests: ["Digital Transformation", "Leadership", "Emerging Tech"],
    availability: "By Appointment",
    joinDate: "2020",
    company: "TechVision Africa",
    education: "PhD Computer Science, MIT",
    languages: ["English", "French", "Duala"],
    achievements: [
      "Founded 3 successful tech startups",
      "Led digital transformation for 50+ companies",
      "Published 20+ research papers",
      "Speaker at major tech conferences"
    ],
    testimonials: [
      {
        name: "Sarah Mboum",
        role: "Tech Entrepreneur",
        text: "Dr. Patricia's mentorship transformed my approach to leadership. Her insights on scaling tech companies are invaluable.",
        rating: 5
      },
      {
        name: "David Fon",
        role: "Startup Founder",
        text: "Her strategic guidance helped me navigate the complexities of building a tech company in Africa.",
        rating: 5
      }
    ],
    expertise: [
      {
        title: "Strategic Planning",
        description: "Helping leaders develop comprehensive strategies for growth and innovation",
        level: "Expert"
      },
      {
        title: "Tech Leadership",
        description: "Building and leading high-performing tech teams",
        level: "Expert"
      },
      {
        title: "Innovation Management",
        description: "Creating cultures of innovation and managing change",
        level: "Expert"
      }
    ],
    social: {
      linkedin: "https://linkedin.com/in/dr-patricia-nguema",
      twitter: "https://twitter.com/dr_patricia_tech",
      website: "https://techvisionafrica.com"
    }
  },
  "marcus-ai-pioneer": {
    id: "marcus-ai-pioneer",
    name: "Marcus Fon",
    role: "AI Research Director",
    location: "Yaoundé",
    experience: "12+ years",
    specialties: ["Machine Learning", "AI Ethics", "Research & Development"],
    bio: "AI researcher passionate about ethical technology development. Marcus guides students through the complex world of artificial intelligence, emphasizing responsible innovation and human-centered design. His research focuses on making AI accessible and beneficial for African communities.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    badges: ["AI Expert", "Research Leader", "Ethics Advocate"],
    stats: { mentees: 150, sessions: 120, rating: 4.8 },
    interests: ["Deep Learning", "Computer Vision", "Ethical AI"],
    availability: "Weekends",
    joinDate: "2021",
    company: "AI Research Institute",
    education: "PhD Artificial Intelligence, Stanford",
    languages: ["English", "French"],
    achievements: [
      "Published 30+ AI research papers",
      "Led breakthrough AI projects",
      "Advocate for ethical AI development",
      "Mentored 150+ AI researchers"
    ],
    testimonials: [
      {
        name: "Grace Tchoumi",
        role: "AI Researcher",
        text: "Marcus's approach to ethical AI development opened my eyes to the importance of responsible innovation.",
        rating: 5
      }
    ],
    expertise: [
      {
        title: "Machine Learning",
        description: "Advanced ML algorithms and model development",
        level: "Expert"
      },
      {
        title: "AI Ethics",
        description: "Ensuring AI systems are fair, transparent, and beneficial",
        level: "Expert"
      },
      {
        title: "Research & Development",
        description: "Leading cutting-edge AI research projects",
        level: "Expert"
      }
    ],
    social: {
      linkedin: "https://linkedin.com/in/marcus-fon",
      twitter: "https://twitter.com/marcus_ai",
      github: "https://github.com/marcus-fon"
    }
  }
  // Add more mentors as needed
}

const MentorProfilePage = ({ params }: { params: { slug: string } }) => {
  const mentor = mentorData[params.slug as keyof typeof mentorData]
  
  if (!mentor) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentor Not Found</h1>
            <p className="text-gray-600 mb-8">The mentor you're looking for doesn't exist.</p>
            <Link href="/mentors">
              <Button>Back to Mentors</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
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
        ease: "easeOut",
      },
    },
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/mentors" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Mentors</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center"
            >
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="relative">
                  <div className="w-64 h-64 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                    <GraduationCap className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold mb-4">{mentor.name}</h1>
                <p className="text-2xl text-white/80 mb-6">{mentor.role}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Location</p>
                      <p className="text-white font-medium">{mentor.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Experience</p>
                      <p className="text-white font-medium">{mentor.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Rating</p>
                      <p className="text-white font-medium">{mentor.stats.rating}/5.0</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white hover:bg-white text-gray-900 group">
                    <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Request Mentorship
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                    <Share2 className="mr-2 w-5 h-5" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
                <p className="text-gray-600 leading-relaxed">{mentor.bio}</p>
              </motion.div>

              {/* Expertise Areas */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Expertise Areas</h2>
                <div className="space-y-6">
                  {mentor.expertise.map((area, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{area.title}</h3>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {area.level}
                        </span>
                      </div>
                      <p className="text-gray-600">{area.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h2>
                <div className="space-y-4">
                  {mentor.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                      </div>
                      <p className="text-gray-600">{achievement}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonials */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mentee Testimonials</h2>
                <div className="space-y-6">
                  {mentor.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-gray-500 pl-6">
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-3 italic">"{testimonial.text}"</p>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Stats */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Mentoring Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-600">Mentees Guided</span>
                    </div>
                    <span className="font-bold text-gray-900">{mentor.stats.mentees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-gray-600">Sessions Conducted</span>
                    </div>
                    <span className="font-bold text-gray-900">{mentor.stats.sessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-600">Average Rating</span>
                    </div>
                    <span className="font-bold text-gray-900">{mentor.stats.rating}/5.0</span>
                  </div>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{mentor.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Available {mentor.availability}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Joined {mentor.joinDate}</span>
                  </div>
                </div>
              </motion.div>

              {/* Professional Background */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Professional Background</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">Education</p>
                    <p className="text-gray-600">{mentor.education}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Current Company</p>
                    <p className="text-gray-600">{mentor.company}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Languages</p>
                    <p className="text-gray-600">{mentor.languages.join(", ")}</p>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Connect</h3>
                <div className="space-y-3">
                  {mentor.social.linkedin && (
                    <a
                      href={mentor.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">in</span>
                      </div>
                      <span className="text-gray-700">LinkedIn</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  {mentor.social.twitter && (
                    <a
                      href={mentor.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">𝕏</span>
                      </div>
                      <span className="text-gray-700">Twitter</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  {mentor.social.github && (
                    <a
                      href={mentor.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">GH</span>
                      </div>
                      <span className="text-gray-700">GitHub</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                  {mentor.social.website && (
                    <a
                      href={mentor.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">Website</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Request Mentorship CTA */}
              <motion.div variants={itemVariants} className="bg-gray-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Ready to Get Mentored?</h3>
                <p className="text-white/90 mb-6">
                  Connect with {mentor.name.split(' ')[0]} for personalized guidance and support.
                </p>
                <Button className="w-full bg-white hover:bg-white text-gray-900">
                  Request Mentorship Session
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default MentorProfilePage
