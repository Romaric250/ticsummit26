export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  year: number
  likes: number
  comments: number
  views: number
  author: {
    name: string
    avatar: string
    school: string
  }
  slug: string
  category: string
}

export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  image: string
  bio: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date?: string // Legacy field, prefer publishedAt
  publishedAt?: Date
  image: string
  tags: string[]
  readTime?: number
  featured?: boolean
}

export interface SessionSpeaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  image: string
  social?: Record<string, string>
  topics?: string[]
}

export interface Session {
  id: string
  title: string
  description: string
  speaker: SessionSpeaker
  startTime: Date
  endTime: Date
  room: string
  type: string
  level: string
  tags: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  year: number
  category: string
}