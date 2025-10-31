"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, Plus, Trash2, Edit, X, ImageIcon, ArrowUp, ArrowDown, Users, FileText, Quote, Settings } from "lucide-react"
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

  // Modal States
  const [showFounderModal, setShowFounderModal] = useState(false)
  const [showHeroCarouselModal, setShowHeroCarouselModal] = useState(false)
  const [showStudentsCarouselModal, setShowStudentsCarouselModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
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
                  const updated = { ...currentMember, name: e.target.value }
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

export default MinorUpdatesPage
