"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Trophy, Star } from "lucide-react"

interface SuccessStory {
  name: string
  age: number
  school: string
  achievement: string
  quote: string
  icon: string
  fullStory: string
  programYear: string
  currentStatus: string
}

interface SuccessStoryModalProps {
  isOpen: boolean
  stories: SuccessStory[]
  selectedIndex: number | null
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onSelectStory: (index: number) => void
}

export const SuccessStoryModal = ({
  isOpen,
  stories,
  selectedIndex,
  onClose,
  onNext,
  onPrev,
  onSelectStory
}: SuccessStoryModalProps) => {
  if (!isOpen || selectedIndex === null) return null

  const currentStory = stories[selectedIndex]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20 md:pt-24"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>

            {/* Navigation Arrows */}
            {stories.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPrev()
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onNext()
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                </button>
              </>
            )}

            {/* Story Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 lg:p-12"
              >
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{currentStory.name}</h3>
                  <div className="text-gray-600 mb-4 text-sm md:text-base">
                    Age {currentStory.age} • {currentStory.school}
                  </div>
                  <div className="bg-gray-900 rounded-xl p-3 md:p-4 inline-block">
                    <p className="text-base md:text-lg font-semibold flex items-center justify-center text-white">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-400" />
                      {currentStory.achievement}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 flex items-center text-gray-900">
                      <Star className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-400" />
                      Their Story
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {currentStory.fullStory}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 md:pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Program Year</p>
                      <p className="text-base md:text-lg font-semibold text-gray-900">{currentStory.programYear}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Current Status</p>
                      <p className="text-base md:text-lg font-semibold text-gray-900">{currentStory.currentStatus}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                    <p className="text-gray-700 italic text-base md:text-lg leading-relaxed text-center">
                      "{currentStory.quote}"
                    </p>
                  </div>
                </div>

                {/* Story Indicator */}
                <div className="flex justify-center gap-2 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectStory(index)
                      }}
                      className={`h-2 rounded-full transition-all ${
                        index === selectedIndex ? 'bg-gray-900 w-6 md:w-8' : 'bg-gray-300 w-2'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

