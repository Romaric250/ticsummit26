"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  Edit
} from "lucide-react"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/auth-client"

const AdminSidebar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      name: "Hall of Fame",
      href: "/admin/hall-of-fame",
      icon: Trophy
    },
    {
      name: "Mentors",
      href: "/admin/mentors",
      icon: Users
    },
    {
      name: "Ambassadors",
      href: "/admin/ambassadors",
      icon: Users
    },
    {
      name: "Blog Posts",
      href: "/admin/blogs",
      icon: FileText
    },
    {
      name: "Schedule",
      href: "/admin/schedule",
      icon: Calendar
    },
    {
      name: "Alumni Stories",
      href: "/admin/alumni",
      icon: GraduationCap
    },
    {
      name: "Tech Girls",
      href: "/admin/applicants",
      icon: Users
    },
    {
      name: "Minor Updates",
      href: "/admin/minor-updates",
      icon: Edit
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg border border-gray-700"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-40 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <Link 
            href="/admin" 
            className="flex items-center space-x-3 mb-8"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">T</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">
                TIC Summit
              </span>
              <span className="text-xs text-gray-400">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${
                    isActive 
                      ? 'bg-white text-gray-900' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sign Out */}
          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default AdminSidebar
