"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface TechStackInputProps {
  value: string[]
  onChange: (techStack: string[]) => void
  placeholder?: string
}

export const TechStackInput = ({ value, onChange, placeholder = "Add technology..." }: TechStackInputProps) => {
  const [inputValue, setInputValue] = useState("")

  const addTech = () => {
    const tech = inputValue.trim()
    if (tech && !value.includes(tech)) {
      onChange([...value, tech])
      setInputValue("")
    }
  }

  const removeTech = (techToRemove: string) => {
    onChange(value.filter(tech => tech !== techToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTech()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
        />
        <Button
          type="button"
          onClick={addTech}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 border border-gray-200 text-sm rounded-full"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="hover:text-red-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
