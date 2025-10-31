"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Users, 
  FileText, 
  GraduationCap,
  Eye,
  Heart,
  BarChart3,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import dynamic from "next/dynamic"
import Layout from "@/components/layout/Layout"

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface Stats {
  blogs: number
  publishedBlogs: number
  projects: number
  mentors: number
  alumni: number
  totalViews: number
  totalLikes: number
}

interface ChartData {
  date: string
  count: number
}

interface AdminStats {
  counts: Stats
  charts: {
    blogsLast7Days: ChartData[]
    projectsLast7Days: ChartData[]
    projectsByStatus: Array<{ status: string; count: number }>
    blogsByCategory: Array<{ category: string; count: number }>
  }
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    blogs: 0,
    publishedBlogs: 0,
    projects: 0,
    mentors: 0,
    alumni: 0,
    totalViews: 0,
    totalLikes: 0,
  })
  const [chartData, setChartData] = useState<AdminStats["charts"] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats")
      const data = await response.json()

      if (data.success && data.data) {
        setStats(data.data.counts)
        setChartData(data.data.charts)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Blog Posts",
      count: stats.blogs,
      published: stats.publishedBlogs,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/blogs"
    },
    {
      title: "Hall of Fame Projects",
      count: stats.projects,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/hall-of-fame"
    },
    {
      title: "Mentors",
      count: stats.mentors,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/mentors"
    },
    {
      title: "Alumni Stories",
      count: stats.alumni,
      icon: GraduationCap,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/alumni"
    }
  ]

  // Line chart options for blogs and projects over time
  const lineChartOptions = {
    chart: {
      type: "line" as const,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#1f2937"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth" as const,
      width: 2
    },
    xaxis: {
      categories: chartData?.blogsLast7Days.map(d => {
        const date = new Date(d.date)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }) || [],
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px"
        }
      }
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4
    },
    tooltip: {
      theme: "light" as const
    }
  }

  // Pie chart options
  const pieChartOptions = {
    chart: {
      type: "pie" as const,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    labels: [] as string[],
    colors: ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb"],
    legend: {
      position: "bottom" as const,
      fontSize: "12px",
      labels: {
        colors: "#374151"
      }
    },
    tooltip: {
      theme: "light" as const
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-600">
                Overview of your TIC Summit content and analytics
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Link href={stat.href}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.count}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {stat.title}
                  </p>
                  {stat.published !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.published} published
                    </p>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Additional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Total Likes</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activity Over Time Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Activity Over Time
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Last 7 days</p>
                </div>
              </div>
              {chartData && typeof window !== "undefined" && (
                <Chart
                  options={lineChartOptions}
                  series={[
                    {
                      name: "Blogs",
                      data: chartData.blogsLast7Days.map(d => d.count)
                    },
                    {
                      name: "Projects",
                      data: chartData.projectsLast7Days.map(d => d.count)
                    }
                  ]}
                  type="line"
                  height={300}
                />
              )}
            </motion.div>

            {/* Projects by Status Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Projects by Status
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Distribution</p>
                </div>
              </div>
              {chartData && typeof window !== "undefined" && (
                <Chart
                  options={{
                    ...pieChartOptions,
                    labels: chartData.projectsByStatus.map(item => item.status.replace("_", " "))
                  }}
                  series={chartData.projectsByStatus.map(item => item.count)}
                  type="pie"
                  height={300}
                />
              )}
            </motion.div>
          </div>

          {/* Blogs by Category Chart */}
          {chartData && chartData.blogsByCategory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Blogs by Category
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Distribution</p>
                </div>
              </div>
              {typeof window !== "undefined" && (
                <Chart
                  options={{
                    ...pieChartOptions,
                    labels: chartData.blogsByCategory.map(item => item.category)
                  }}
                  series={chartData.blogsByCategory.map(item => item.count)}
                  type="pie"
                  height={300}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
