"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit, ArrowUp, ArrowDown, X, Save } from "lucide-react"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"

interface TimelinePhase {
  id?: string
  title: string
  duration: string
  status: "COMPLETED" | "ACTIVE" | "UPCOMING"
  description: string
  details: string[]
  iconName?: string
  color?: string
  participants?: string
  order: number
}

const ScheduleAdminPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [phases, setPhases] = useState<TimelinePhase[]>([])
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null)

  const statusOptions = ["COMPLETED", "ACTIVE", "UPCOMING"]
  const colorOptions = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-yellow-500"
  ]

  useEffect(() => {
    fetchPhases()
  }, [])

  const fetchPhases = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/content/timeline-phases")
      const data = await response.json()
      if (data.success) {
        const sorted = data.data.sort((a: TimelinePhase, b: TimelinePhase) => a.order - b.order)
        setPhases(sorted)
      }
    } catch (error) {
      console.error("Error fetching phases:", error)
      toast.error("Failed to load timeline phases")
    } finally {
      setLoading(false)
    }
  }

  const handleSavePhases = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/content/timeline-phases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phases })
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Timeline phases updated successfully")
        await fetchPhases()
      } else {
        toast.error("Failed to update phases")
      }
    } catch (error) {
      console.error("Error saving phases:", error)
      toast.error("Failed to save phases")
    } finally {
      setSaving(false)
      setEditingPhaseId(null)
    }
  }

  const handleAddPhase = () => {
    const newPhase: TimelinePhase = {
      title: "",
      duration: "",
      status: "UPCOMING",
      description: "",
      details: [],
      color: "bg-gray-500",
      order: phases.length,
      participants: ""
    }
    setPhases([...phases, newPhase])
    setEditingPhaseId("new")
  }

  const handleDeletePhase = async (phaseId?: string) => {
    if (!phaseId || phaseId === "new") {
      setPhases(phases.slice(0, -1))
      setEditingPhaseId(null)
      return
    }

    try {
      const response = await fetch(`/api/content/timeline-phases/${phaseId}`, {
        method: "DELETE"
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Phase deleted successfully")
        await fetchPhases()
      } else {
        toast.error("Failed to delete phase")
      }
    } catch (error) {
      console.error("Error deleting phase:", error)
      toast.error("Failed to delete phase")
    }
  }

  const handleMovePhase = (index: number, direction: "up" | "down") => {
    const newPhases = [...phases]
    const newIndex = direction === "up" ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= newPhases.length) return

    const temp = newPhases[index]
    newPhases[index] = newPhases[newIndex]
    newPhases[newIndex] = temp

    newPhases[index].order = index
    newPhases[newIndex].order = newIndex

    setPhases(newPhases)
  }

  const handleAddDetail = (phaseIndex: number) => {
    const updated = [...phases]
    updated[phaseIndex].details = [...updated[phaseIndex].details, ""]
    setPhases(updated)
  }

  const handleUpdateDetail = (phaseIndex: number, detailIndex: number, value: string) => {
    const updated = [...phases]
    updated[phaseIndex].details[detailIndex] = value
    setPhases(updated)
  }

  const handleRemoveDetail = (phaseIndex: number, detailIndex: number) => {
    const updated = [...phases]
    updated[phaseIndex].details = updated[phaseIndex].details.filter((_, i) => i !== detailIndex)
    setPhases(updated)
  }

  const handleSetActive = (phaseIndex: number) => {
    const updated = phases.map((phase, index) => ({
      ...phase,
      status: (index === phaseIndex ? "ACTIVE" : phase.status === "ACTIVE" ? "UPCOMING" : phase.status) as "COMPLETED" | "ACTIVE" | "UPCOMING"
    }))
    setPhases(updated)
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
            <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
            <p className="text-gray-600 mt-1">Manage timeline phases and set active phase</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Timeline Phases</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPhase}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                Add Phase
              </motion.button>
            </div>

            <div className="space-y-6">
              {phases.map((phase, index) => (
                <div key={phase.id || index} className="border border-gray-200 rounded-lg p-6">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${phase.color || "bg-gray-500"} rounded-lg flex items-center justify-center text-white font-bold`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{phase.title || "Untitled Phase"}</h3>
                          <p className="text-sm text-gray-600">{phase.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMovePhase(index, "up")}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMovePhase(index, "down")}
                          disabled={index === phases.length - 1}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSetActive(index)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            phase.status === "ACTIVE"
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          title="Set as active"
                        >
                          {phase.status === "ACTIVE" ? "Active" : "Set Active"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeletePhase(phase.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={phase.title}
                          onChange={(e) => {
                            const updated = [...phases]
                            updated[index] = { ...updated[index], title: e.target.value }
                            setPhases(updated)
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={phase.duration}
                          onChange={(e) => {
                            const updated = [...phases]
                            updated[index] = { ...updated[index], duration: e.target.value }
                            setPhases(updated)
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="e.g., Jan - Mar 2025"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={phase.status}
                          onChange={(e) => {
                            const updated = [...phases]
                            updated[index] = { ...updated[index], status: e.target.value as any }
                            setPhases(updated)
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <select
                          value={phase.color || ""}
                          onChange={(e) => {
                            const updated = [...phases]
                            updated[index] = { ...updated[index], color: e.target.value }
                            setPhases(updated)
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {colorOptions.map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={phase.description}
                        onChange={(e) => {
                          const updated = [...phases]
                          updated[index] = { ...updated[index], description: e.target.value }
                          setPhases(updated)
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                      <input
                        type="text"
                        value={phase.participants || ""}
                        onChange={(e) => {
                          const updated = [...phases]
                          updated[index] = { ...updated[index], participants: e.target.value }
                          setPhases(updated)
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g., 5000+ students"
                      />
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Details</label>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddDetail(index)}
                          className="text-sm text-primary hover:text-primary/80 cursor-pointer"
                        >
                          + Add Detail
                        </motion.button>
                      </div>
                      <div className="space-y-2">
                        {phase.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={detail}
                              onChange={(e) => handleUpdateDetail(index, detailIndex, e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Detail text"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveDetail(index, detailIndex)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {phases.length > 0 && (
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSavePhases}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {saving ? "Saving..." : "Save All Phases"}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ScheduleAdminPage

