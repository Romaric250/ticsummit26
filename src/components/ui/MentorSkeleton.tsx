import { motion } from "framer-motion"

export const MentorCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Profile Image Skeleton */}
      <div className="h-64 bg-gray-300"></div>
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Name and Info */}
        <div className="mb-4">
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="flex items-center space-x-4 mb-2">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>

        {/* Bio Skeleton */}
        <div className="mb-4">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>

        {/* Specialties Skeleton */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
            <div className="h-6 bg-gray-300 rounded-full w-20"></div>
            <div className="h-6 bg-gray-300 rounded-full w-14"></div>
          </div>
        </div>

        {/* Languages Skeleton */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            <div className="h-6 bg-gray-300 rounded-full w-12"></div>
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          </div>
        </div>

        {/* Status Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export const MentorListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <MentorCardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

export const MentorDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image Skeleton */}
              <div className="lg:w-1/3">
                <div className="w-full h-80 bg-gray-700 rounded-2xl"></div>
              </div>
              
              {/* Content Skeleton */}
              <div className="lg:w-2/3 text-white">
                <div className="h-8 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded mb-2 w-1/2"></div>
                <div className="h-6 bg-gray-700 rounded mb-6 w-1/3"></div>
                
                <div className="space-y-4 mb-8">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 bg-gray-700 rounded w-32"></div>
                  <div className="h-10 bg-gray-700 rounded w-28"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="h-6 bg-gray-300 rounded mb-4 w-1/4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>
                </div>
                
                <div>
                  <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-8 bg-gray-300 rounded-full w-24"></div>
                    <div className="h-8 bg-gray-300 rounded-full w-18"></div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                
                <div>
                  <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
