"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface MembersInputProps {
  value: string[]
  onChange: (members: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export const MembersInput = ({ 
  value, 
  onChange, 
  placeholder = "Add team members...",
  disabled = false 
}: MembersInputProps) => {
  const [inputValue, setInputValue] = useState("")

  const handleAddMember = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleRemoveMember = (memberToRemove: string) => {
    onChange(value.filter(member => member !== memberToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddMember()
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Team Members
      </label>
      
      {/* Input field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          type="button"
          onClick={handleAddMember}
          disabled={disabled || !inputValue.trim() || value.includes(inputValue.trim())}
          className="px-4 py-2"
        >
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Members list */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {value.map((member, index) => (
              <motion.div
                key={member}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
              >
                <span>{member}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      <p className="text-xs text-gray-400">
        Press Enter or click the + button to add a member
      </p>
    </div>
  )
}
