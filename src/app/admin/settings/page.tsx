"use client"

import { useState, useEffect, useCallback } from "react"
import { Settings, Users, Shield, ShieldOff, Mail, Calendar, Search, X } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import Image from "next/image"

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: "STUDENT" | "MENTOR" | "VOLUNTEER" | "ADMIN"
  emailVerified: boolean
  createdAt: string
}

const SettingsPage = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [siteSettings, setSiteSettings] = useState({
    showTeamSection: true,
    showPartnerNames: true
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

  const fetchUsers = useCallback(async (search = "") => {
    try {
      setLoadingUsers(true)
      const url = search
        ? `/api/admin/users?search=${encodeURIComponent(search)}`
        : "/api/admin/users"
      const response = await fetch(url)
      const data = await response.json()
      if (data.success && data.data) {
        setUsers(data.data)
      } else {
        toast.error("Failed to load users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  // Debounce search and initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery)
    }, searchQuery ? 300 : 0) // No delay for initial load

    return () => clearTimeout(timer)
  }, [searchQuery, fetchUsers])

  const handleToggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      setUpdatingUser(userId)
      const newRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN"
      
      console.log("Attempting to update user role:", { userId, newRole, currentRole })
      
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(
          newRole === "ADMIN"
            ? "User promoted to admin"
            : "Admin role removed from user"
        )
        await fetchUsers(searchQuery)
      } else {
        console.error("Error response:", data)
        toast.error(data.error || "Failed to update user role")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    } finally {
      setUpdatingUser(null)
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Show Partner Names</p>
                <p className="text-xs text-gray-600 mt-1">
                  Display organization names alongside partner logos on the home page
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = { ...siteSettings, showPartnerNames: !siteSettings.showPartnerNames }
                  handleSaveSiteSettings(updated)
                }}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
                  siteSettings.showPartnerNames ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    siteSettings.showPartnerNames ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">View all users and manage admin roles</p>
              </div>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {loadingUsers ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isCurrentUser = session?.user?.id === user.id
                    const isAdmin = user.role === "ADMIN"
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || user.email}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                  {(user.name || user.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.name || "No name"}
                              </p>
                              {isCurrentUser && (
                                <p className="text-xs text-gray-500">(You)</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{user.email}</span>
                            {user.emailVerified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isAdmin
                                ? "bg-gray-900 text-white"
                                : user.role === "MENTOR"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "VOLUNTEER"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {isCurrentUser ? (
                            <span className="text-sm text-gray-500 italic">
                              Cannot modify your own role
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggleAdminRole(user.id, user.role)}
                              disabled={updatingUser === user.id}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isAdmin
                                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                                  : "bg-gray-900 text-white hover:bg-gray-800"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {updatingUser === user.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                  Updating...
                                </>
                              ) : isAdmin ? (
                                <>
                                  <ShieldOff className="w-4 h-4" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="w-4 h-4" />
                                  Make Admin
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery ? "No users found matching your search" : "No users found"}
                  </p>
                </div>
              )}
              {users.length === 20 && (
                <div className="text-center py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Showing first 20 results{searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage