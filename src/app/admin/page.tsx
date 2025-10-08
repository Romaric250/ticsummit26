"use client"

import { motion } from "framer-motion"
import { 
  Trophy, 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap,
  TrendingUp,
  Eye,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

const AdminDashboard = () => {
  const stats = [
    {
      title: "Hall of Fame Entries",
      count: 24,
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      href: "/admin/hall-of-fame"
    },
    {
      title: "Mentors",
      count: 12,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      href: "/admin/mentors"
    },
    {
      title: "Blog Posts",
      count: 8,
      icon: FileText,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      href: "/admin/blogs"
    },
    {
      title: "Alumni Stories",
      count: 15,
      icon: GraduationCap,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      href: "/admin/alumni"
    }
  ]

  const recentActivities = [
    {
      type: "blog",
      title: "New blog post published",
      description: "TIC Summit 2025: Innovation Trends",
      time: "2 hours ago"
    },
    {
      type: "mentor",
      title: "New mentor added",
      description: "Dr. Sarah Johnson - AI Specialist",
      time: "4 hours ago"
    },
    {
      type: "hall-of-fame",
      title: "Hall of Fame entry updated",
      description: "Student Innovation Award Winner",
      time: "1 day ago"
    }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">
          Manage your TIC Summit content and settings
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Link href={stat.href}>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-white text-gray-900 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.count}
              </h3>
              <p className="text-gray-400 text-sm">
                {stat.title}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8"
      >
        <h2 className="text-xl font-bold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/blogs/new">
            <Button className="w-full bg-white hover:bg-white text-gray-900 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Button>
          </Link>
          <Link href="/admin/mentors/new">
            <Button className="w-full bg-white hover:bg-white text-gray-900 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Mentor
            </Button>
          </Link>
          <Link href="/admin/hall-of-fame/new">
            <Button className="w-full bg-white hover:bg-white text-gray-900 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add to Hall of Fame
            </Button>
          </Link>
          <Link href="/admin/alumni/new">
            <Button className="w-full bg-white hover:bg-white text-gray-900 cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Alumni Story
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Recent Activity
          </h2>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <div className="flex-1">
                <h3 className="text-white font-medium">
                  {activity.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {activity.description}
                </p>
              </div>
              <span className="text-gray-500 text-sm">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
