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
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
    >
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gray-700 animate-pulse">
        <div className="absolute top-3 left-3">
          <div className="w-12 h-6 bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title and Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse ml-2"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>

        {/* Tech Stack */}
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-14 h-6 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Members */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex gap-1">
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-8 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-8 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}

interface ProjectDetailSkeletonProps {}

export const ProjectDetailSkeleton = ({}: ProjectDetailSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 space-y-8">
            {/* Project Title */}
            <div className="space-y-4">
              {/* Status Badges */}
              <div className="flex items-center gap-3">
                <div className="w-24 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              
              <div className="h-12 bg-gray-700 rounded animate-pulse w-3/4"></div>
              
              {/* About Project */}
              <div className="h-6 bg-gray-700 rounded animate-pulse w-32"></div>
              
              {/* Project Description */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Image Slider */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="h-96 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="h-5 bg-gray-700 rounded animate-pulse w-16 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="h-5 bg-gray-700 rounded animate-pulse w-24 mb-4"></div>
              <div className="space-y-4">
                {/* Team Members */}
                <div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-20 mb-2"></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-16 h-3 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-18 h-3 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-16 mb-2"></div>
                  <div className="flex flex-wrap gap-1">
                    <div className="w-12 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="w-16 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="w-14 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="w-18 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Project Phase */}
                <div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-20 mb-1"></div>
                  <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>

                {/* Year */}
                <div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-8 mb-1"></div>
                  <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Similar Projects */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="h-5 bg-gray-700 rounded animate-pulse w-28 mb-4"></div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-3">
                    <div className="h-20 bg-gray-600 rounded-lg mb-2 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-600 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="h-10 bg-gray-700 rounded animate-pulse mt-4"></div>
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
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="h-16 bg-gray-700 rounded animate-pulse w-80 mx-auto"></div>
            <div className="h-6 bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="h-8 bg-gray-600 rounded animate-pulse w-12 mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="py-8 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-700 rounded-lg animate-pulse w-32"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="py-16">
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
