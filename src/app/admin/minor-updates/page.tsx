"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Plus, Trash2, Edit, X, ImageIcon, ArrowUp, ArrowDown } from "lucide-react"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"
import { useUploadThing } from "@/lib/uploadthing"

interface FounderQuote {
  id?: string
  initial: string
  name: string
  title: string
  quote: string
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
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null) // Track which slide is uploading
  
  const { startUpload } = useUploadThing("blogImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url && uploadingImage) {
        const [type, index] = uploadingImage.split(":")
        if (type === "hero") {
          const updated = [...heroCarousel]
          updated[parseInt(index)].imageUrl = res[0].url
          setHeroCarousel(updated)
        } else if (type === "students") {
          const updated = [...studentsCarousel]
          updated[parseInt(index)].imageUrl = res[0].url
          setStudentsCarousel(updated)
        }
        setUploadingImage(null)
        toast.success("Image uploaded successfully")
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error)
      setUploadingImage(null)
      toast.error("Failed to upload image")
    },
  })

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
        await fetchData()
      } else {
        toast.error("Failed to update carousel")
      }
    } catch (error) {
      console.error("Error saving carousel:", error)
      toast.error("Failed to save carousel")
    } finally {
      setSaving(false)
      setEditingSlideId(null)
    }
  }

  const handleAddSlide = (type: "HERO" | "STUDENTS") => {
    const newSlide: CarouselSlide = {
      imageUrl: "",
      title: "",
      subtitle: "",
      description: "",
      category: "",
      order: type === "HERO" ? heroCarousel.length : studentsCarousel.length,
      active: true
    }

    if (type === "HERO") {
      setHeroCarousel([...heroCarousel, newSlide])
    } else {
      setStudentsCarousel([...studentsCarousel, newSlide])
    }
    setEditingSlideId("new")
  }

  const handleDeleteSlide = async (type: "HERO" | "STUDENTS", slideId?: string) => {
    if (!slideId || slideId === "new") {
      if (type === "HERO") {
        setHeroCarousel(heroCarousel.slice(0, -1))
      } else {
        setStudentsCarousel(studentsCarousel.slice(0, -1))
      }
      setEditingSlideId(null)
      return
    }

    try {
      const response = await fetch(`/api/content/carousels/${slideId}`, {
        method: "DELETE"
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Slide deleted successfully")
        await fetchData()
      } else {
        toast.error("Failed to delete slide")
      }
    } catch (error) {
      console.error("Error deleting slide:", error)
      toast.error("Failed to delete slide")
    }
  }

  const handleMoveSlide = (type: "HERO" | "STUDENTS", index: number, direction: "up" | "down") => {
    const carousel = type === "HERO" ? heroCarousel : studentsCarousel
    const setCarousel = type === "HERO" ? setHeroCarousel : setStudentsCarousel
    
    const newCarousel = [...carousel]
    const newIndex = direction === "up" ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newCarousel.length) return

    const temp = newCarousel[index]
    newCarousel[index] = newCarousel[newIndex]
    newCarousel[newIndex] = temp
    
    newCarousel[index].order = index
    newCarousel[newIndex].order = newIndex
    
    setCarousel(newCarousel)
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
            <p className="text-gray-600 mt-1">Manage founder quote and home page carousels</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Founder Quote Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Word from Our Founder</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Letter
                  </label>
                  <input
                    type="text"
                    value={founderQuote.initial}
                    onChange={(e) => setFounderQuote({...founderQuote, initial: e.target.value})}
                    maxLength={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={founderQuote.name}
                    onChange={(e) => setFounderQuote({...founderQuote, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={founderQuote.title}
                  onChange={(e) => setFounderQuote({...founderQuote, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote
                </label>
                <textarea
                  rows={4}
                  value={founderQuote.quote}
                  onChange={(e) => setFounderQuote({...founderQuote, quote: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveFounderQuote}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {saving ? "Saving..." : "Save Quote"}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Hero Carousel Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Hero Carousel</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddSlide("HERO")}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                Add Slide
              </motion.button>
            </div>

            <div className="space-y-4">
              {heroCarousel.map((slide, index) => (
                <div key={slide.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {slide.imageUrl ? (
                        <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.imageUrl}
                            onChange={(e) => {
                              const updated = [...heroCarousel]
                              updated[index] = {...updated[index], imageUrl: e.target.value}
                              setHeroCarousel(updated)
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Image URL"
                          />
                          <label className="flex-shrink-0 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                            <ImageIcon className="h-4 w-4 inline mr-1" />
                            {uploadingImage === `hero:${index}` ? "Uploading..." : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={saving || uploadingImage !== null}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadingImage(`hero:${index}`)
                                  startUpload([file])
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const updated = [...heroCarousel]
                              updated[index] = {...updated[index], title: e.target.value}
                              setHeroCarousel(updated)
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={slide.subtitle || ""}
                            onChange={(e) => {
                              const updated = [...heroCarousel]
                              updated[index] = {...updated[index], subtitle: e.target.value}
                              setHeroCarousel(updated)
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={slide.description || ""}
                          onChange={(e) => {
                            const updated = [...heroCarousel]
                            updated[index] = {...updated[index], description: e.target.value}
                            setHeroCarousel(updated)
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoveSlide("HERO", index, "up")}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoveSlide("HERO", index, "down")}
                          disabled={index === heroCarousel.length - 1}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteSlide("HERO", slide.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {heroCarousel.length > 0 && (
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveCarousel("HERO", heroCarousel)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {saving ? "Saving..." : "Save Hero Carousel"}
                </motion.button>
              </div>
            )}
          </div>

          {/* Students Carousel Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Students in Action Carousel</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddSlide("STUDENTS")}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                Add Slide
              </motion.button>
            </div>

            <div className="space-y-4">
              {studentsCarousel.map((slide, index) => (
                <div key={slide.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      {slide.imageUrl ? (
                        <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.imageUrl}
                            onChange={(e) => {
                              const updated = [...studentsCarousel]
                              updated[index] = {...updated[index], imageUrl: e.target.value}
                              setStudentsCarousel(updated)
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Image URL"
                          />
                          <label className="flex-shrink-0 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                            <ImageIcon className="h-4 w-4 inline mr-1" />
                            {uploadingImage === `students:${index}` ? "Uploading..." : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={saving || uploadingImage !== null}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadingImage(`students:${index}`)
                                  startUpload([file])
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const updated = [...studentsCarousel]
                              updated[index] = {...updated[index], title: e.target.value}
                              setStudentsCarousel(updated)
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            value={slide.category || ""}
                            onChange={(e) => {
                              const updated = [...studentsCarousel]
                              updated[index] = {...updated[index], category: e.target.value}
                              setStudentsCarousel(updated)
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={slide.description || ""}
                          onChange={(e) => {
                            const updated = [...studentsCarousel]
                            updated[index] = {...updated[index], description: e.target.value}
                            setStudentsCarousel(updated)
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoveSlide("STUDENTS", index, "up")}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoveSlide("STUDENTS", index, "down")}
                          disabled={index === studentsCarousel.length - 1}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteSlide("STUDENTS", slide.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {studentsCarousel.length > 0 && (
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveCarousel("STUDENTS", studentsCarousel)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {saving ? "Saving..." : "Save Students Carousel"}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MinorUpdatesPage

