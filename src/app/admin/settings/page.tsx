"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Users, Save } from "lucide-react"
import Layout from "@/components/layout/Layout"
import { toast } from "sonner"

const SettingsPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteSettings, setSiteSettings] = useState({
    showTeamSection: true
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/content/site-settings")
      const data = await response.json()
      if (data.success && data.data) {
        setSiteSettings(data.data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSiteSettings = async (newSettings?: typeof siteSettings) => {
    try {
      setSaving(true)
      const settingsToSave = newSettings || siteSettings
      const response = await fetch("/api/content/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave)
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Settings updated successfully")
        if (newSettings) {
          setSiteSettings(newSettings)
        } else {
          await fetchSettings()
        }
      } else {
        toast.error("Failed to update settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage site configuration and preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Page Visibility</h3>
                <p className="text-sm text-gray-600">Control which sections appear on public pages</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Show Team Section</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Display the "Team Behind the Summit" section on the About page
                  </p>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...siteSettings, showTeamSection: !siteSettings.showTeamSection }
                    handleSaveSiteSettings(updated)
                  }}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
                    siteSettings.showTeamSection ? "bg-gray-900" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      siteSettings.showTeamSection ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SettingsPage

