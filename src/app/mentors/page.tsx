"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  GraduationCap, 
  Award, 
  Calendar, 
  MapPin, 
  Search, 
  Filter,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Coffee,
  Camera,
  Code,
  Palette,
  Music,
  BookOpen,
  Gamepad2,
  Mic,
  Video,
  Lightbulb,
  Target,
  Trophy,
  Gift,
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
  Rocket,
  Crown
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"
import Link from "next/link"

// Mentor data with creative profiles
const mentors = [
  {
    id: "dr-patricia-tech-visionary",
    name: "Dr. Patricia Nguema",
    role: "Senior Tech Executive",
    location: "Douala",
    experience: "15+ years",
    specialties: ["Strategic Planning", "Tech Leadership", "Innovation Management"],
    bio: "Visionary leader with 15+ years transforming organizations through technology. Dr. Patricia mentors the next generation of tech leaders, sharing insights from building successful tech companies across Africa.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    badges: ["Tech Executive", "Innovation Leader", "Industry Pioneer"],
    stats: { mentees: 200, sessions: 150, rating: 4.9 },
    interests: ["Digital Transformation", "Leadership", "Emerging Tech"],
    availability: "By Appointment",
    joinDate: "2020",
    company: "TechVision Africa",
    education: "PhD Computer Science, MIT",
    achievements: [
      "Founded 3 successful tech startups",
      "Led digital transformation for 50+ companies",
      "Published 20+ research papers",
      "Speaker at major tech conferences"
    ]
  },
  {
    id: "marcus-ai-pioneer",
    name: "Marcus Fon",
    role: "AI Research Director",
    location: "Yaoundé",
    experience: "12+ years",
    specialties: ["Machine Learning", "AI Ethics", "Research & Development"],
    bio: "AI researcher passionate about ethical technology development. Marcus guides students through the complex world of artificial intelligence, emphasizing responsible innovation and human-centered design.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    badges: ["AI Expert", "Research Leader", "Ethics Advocate"],
    stats: { mentees: 150, sessions: 120, rating: 4.8 },
    interests: ["Deep Learning", "Computer Vision", "Ethical AI"],
    availability: "Weekends",
    joinDate: "2021",
    company: "AI Research Institute",
    education: "PhD Artificial Intelligence, Stanford",
    achievements: [
      "Published 30+ AI research papers",
      "Led breakthrough AI projects",
      "Advocate for ethical AI development",
      "Mentored 150+ AI researchers"
    ]
  },
  {
    id: "grace-startup-guru",
    name: "Grace Tchoumi",
    role: "Startup Advisor & Investor",
    location: "Bamenda",
    experience: "10+ years",
    specialties: ["Startup Strategy", "Fundraising", "Product Development"],
    bio: "Serial entrepreneur and investor who helps young innovators turn their ideas into successful businesses. Grace brings real-world experience from building and scaling multiple tech startups.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    badges: ["Startup Expert", "Investor", "Serial Entrepreneur"],
    stats: { mentees: 180, sessions: 200, rating: 4.9 },
    interests: ["Venture Capital", "Product Strategy", "Market Analysis"],
    availability: "Flexible",
    joinDate: "2020",
    company: "Venture Partners Africa",
    education: "MBA Entrepreneurship, Wharton",
    achievements: [
      "Founded 5 successful startups",
      "Invested in 50+ early-stage companies",
      "Helped raise $100M+ in funding",
      "Mentored 200+ entrepreneurs"
    ]
  },
  {
    id: "prof-jean-cyber-expert",
    name: "Prof. Jean Mballa",
    role: "Cybersecurity Professor",
    location: "Limbe",
    experience: "20+ years",
    specialties: ["Cybersecurity", "Digital Forensics", "Risk Management"],
    bio: "Distinguished professor and cybersecurity expert with decades of experience protecting organizations from digital threats. Prof. Jean mentors students in the critical field of cybersecurity.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    badges: ["Security Expert", "Professor", "Digital Guardian"],
    stats: { mentees: 120, sessions: 100, rating: 4.7 },
    interests: ["Penetration Testing", "Incident Response", "Security Architecture"],
    availability: "Academic Calendar",
    joinDate: "2019",
    company: "University of Limbe",
    education: "PhD Cybersecurity, Carnegie Mellon",
    achievements: [
      "20+ years in cybersecurity research",
      "Published 40+ security papers",
      "Led major security initiatives",
      "Trained 500+ security professionals"
    ]
  },
  {
    id: "sophie-design-innovator",
    name: "Sophie Nkeng",
    role: "Design Innovation Lead",
    location: "Buea",
    experience: "8+ years",
    specialties: ["Design Thinking", "User Experience", "Creative Strategy"],
    bio: "Design innovator who believes great technology starts with great design. Sophie mentors students in human-centered design, helping them create solutions that truly serve users.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    badges: ["Design Leader", "UX Expert", "Innovation Catalyst"],
    stats: { mentees: 90, sessions: 80, rating: 4.8 },
    interests: ["Design Systems", "User Research", "Creative Process"],
    availability: "Flexible",
    joinDate: "2022",
    company: "Design Studio Africa",
    education: "MFA Design, Parsons",
    achievements: [
      "Led design for 100+ products",
      "Won international design awards",
      "Created design education programs",
      "Mentored 100+ designers"
    ]
  },
  {
    id: "david-blockchain-visionary",
    name: "David Nguema",
    role: "Blockchain Technology Lead",
    location: "Garoua",
    experience: "6+ years",
    specialties: ["Blockchain", "Cryptocurrency", "DeFi"],
    bio: "Blockchain pioneer who's been building decentralized solutions since the early days of crypto. David mentors students in the revolutionary world of blockchain technology and Web3.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    badges: ["Blockchain Expert", "Web3 Pioneer", "DeFi Innovator"],
    stats: { mentees: 80, sessions: 70, rating: 4.6 },
    interests: ["Smart Contracts", "DeFi Protocols", "NFTs"],
    availability: "Evenings",
    joinDate: "2023",
    company: "Blockchain Solutions Cameroon",
    education: "MS Computer Science, ETH Zurich",
    achievements: [
      "Built 20+ blockchain applications",
      "Launched successful DeFi protocols",
      "Speaker at blockchain conferences",
      "Mentored 100+ blockchain developers"
    ]
  }
]

const MentorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  const specialties = [...new Set(mentors.flatMap(m => m.specialties))]
  const locations = [...new Set(mentors.map(m => m.location))]

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSpecialty = !selectedSpecialty || mentor.specialties.includes(selectedSpecialty)
    const matchesLocation = !selectedLocation || mentor.location === selectedLocation

    return matchesSearch && matchesSpecialty && matchesLocation
  })

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
                <GraduationCap className="w-5 h-5 text-white" />
                <span className="text-sm font-medium">Learn from Industry Leaders</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-white">Meet Our</span>
                <span className="block text-white">Expert Mentors</span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Industry veterans who guide students on their journey to becoming tech innovators.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{mentors.length} Expert Mentors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>500+ Students Mentored</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search mentors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  {/* Specialty Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">All Specialties</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mentors Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link href={`/mentors/${mentor.id}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
                      {/* Profile Image */}
                      <div className="relative h-64 bg-gray-900">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 right-4 flex flex-col space-y-2">
                          {mentor.badges.slice(0, 2).map((badge, badgeIndex) => (
                            <span
                              key={badgeIndex}
                              className="bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{mentor.stats.rating}</span>
                        </div>

                        {/* Experience Badge */}
                        <div className="absolute top-4 left-4 bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {mentor.experience}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                            {mentor.name}
                          </h3>
                          <p className="text-gray-600 font-medium mb-2">{mentor.role}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{mentor.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{mentor.company}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {mentor.bio}
                        </p>

                        {/* Specialties */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {mentor.specialties.slice(0, 3).map((specialty, specIndex) => (
                              <span
                                key={specIndex}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                            {mentor.specialties.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                +{mentor.specialties.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{mentor.stats.mentees} mentees</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{mentor.stats.sessions} sessions</span>
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">{mentor.availability}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {filteredMentors.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No mentors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-6">Ready to Find Your Mentor?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect with industry experts who can guide your journey to success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  className="bg-white hover:bg-white text-gray-900 group"
                >
                  Find a Mentor
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Become a Mentor
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default MentorsPage
