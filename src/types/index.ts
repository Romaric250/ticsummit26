export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  year: number
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
  date: string
  image: string
  tags: string[]
}