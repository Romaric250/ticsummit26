"use client"

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
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          {story.icon}
        </div>
        <h3 className="text-xl font-bold mb-1 text-gray-900">{story.name}</h3>
        <div className="text-sm text-gray-600 mb-3">
          Age {story.age} • {story.school}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-center text-white">
          {story.achievement}
        </p>
      </div>

      <p className="text-gray-700 italic text-center leading-relaxed">
        "{story.quote}"
      </p>
    </div>
  )
}

