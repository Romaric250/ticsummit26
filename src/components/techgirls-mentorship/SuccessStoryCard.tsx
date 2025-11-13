"use client"

import { Trophy } from "lucide-react"

interface SuccessStory {
  name: string
  age: number
  school: string
  achievement: string
  quote: string
  icon: string
}

interface SuccessStoryCardProps {
  story: SuccessStory
  index: number
  onClick: () => void
}

export const SuccessStoryCard = ({ story, index, onClick }: SuccessStoryCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-colors cursor-pointer"
    >
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          {story.icon}
        </div>
        <h3 className="text-xl font-bold mb-1">{story.name}</h3>
        <div className="text-sm text-white/70 mb-3">
          Age {story.age} • {story.school}
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold flex items-center justify-center">
          <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
          {story.achievement}
        </p>
      </div>

      <p className="text-white/90 italic text-center leading-relaxed">
        "{story.quote}"
      </p>
    </div>
  )
}

