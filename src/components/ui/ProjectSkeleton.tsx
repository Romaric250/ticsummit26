import { motion } from "framer-motion"

interface ProjectCardSkeletonProps {
  index?: number
}

export const ProjectCardSkeleton = ({ index = 0 }: ProjectCardSkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg"
    >
      {/* Image Skeleton */}
      <div className="relative h-40 bg-gray-100 animate-pulse">
        <div className="absolute top-3 left-3">
          <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title and Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse ml-2"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>

        {/* Tech Stack */}
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-14 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Members */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-1">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}

interface ProjectDetailSkeletonProps {}

export const ProjectDetailSkeleton = ({}: ProjectDetailSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-8">
            {/* Project Title */}
            <div className="space-y-4">
              {/* Status Badges */}
              <div className="flex items-center gap-3">
                <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              
              <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4"></div>
              
              {/* About Project */}
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
              
              {/* Project Description */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Image Slider */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Demo Section Skeleton */}
            <div className="bg-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-40"></div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-6"></div>
              <div className="space-y-6">
                {/* Team Members - Horizontal */}
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-28 mb-3"></div>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2 min-w-[100px]">
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="space-y-1 text-center">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-3"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-16 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-20 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-18 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-14 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Project Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                    <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
                    <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Similar Projects */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-28 mb-4"></div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="h-20 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="h-10 bg-gray-200 rounded animate-pulse mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface HallOfFameSkeletonProps {
  count?: number
}

export const HallOfFameSkeleton = ({ count = 6 }: HallOfFameSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="relative py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-6 bg-white/20 rounded animate-pulse w-80 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="relative sm:w-48">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, index) => (
              <ProjectCardSkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
