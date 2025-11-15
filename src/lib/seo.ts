import { Metadata } from 'next'

// Blog post interface for SEO generation
export interface BlogPostItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  publishedAt?: string
  views: number
  likesCount: number
  readTime?: string
  createdAt: string
  updatedAt: string
  authorName?: string | null // Custom author name (when authorId is not set)
  author: { id: string; name: string | null; image: string | null } | null
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticsummit.org'
const SITE_NAME = 'TIC Summit'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`
const FAVICON_URL = `${SITE_URL}/tic.ico`
const TWITTER_HANDLE = '@ticsummit'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

/**
 * Generate comprehensive metadata for any page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_OG_IMAGE,
    url = SITE_URL,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noindex = false,
    nofollow = false,
  } = config

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = url

  return {
    title: {
      default: fullTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : [{ name: 'TIC Summit Team' }],
    creator: 'TIC Summit',
    publisher: 'TIC Summit',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'technology',
    classification: 'Technology Conference',
    applicationName: SITE_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: FAVICON_URL,
      shortcut: FAVICON_URL,
      apple: FAVICON_URL,
    },
  }
}

/**
 * Generate metadata for blog posts
 * Enhanced for author name and content searchability
 */
export function generateBlogMetadata(post: BlogPostItem): Metadata {
  const url = `${SITE_URL}/blogs/${post.slug}`
  const image = post.image || DEFAULT_OG_IMAGE
  
  // Get author name (prioritize authorName, then author.name)
  const authorName = post.authorName || post.author?.name || 'TIC Summit Team'
  
  // Extract name parts for better searchability
  const nameParts = authorName.trim().split(/\s+/)
  const firstName = nameParts[0] || authorName
  const lastName = nameParts[nameParts.length - 1] || authorName
  
  // Create comprehensive description with author name
  const description = post.excerpt 
    ? `${post.title} by ${authorName}. ${post.excerpt}`
    : `${post.title} by ${authorName}. ${post.content.substring(0, 140)}...`

  // Extract key terms from title and content for keywords
  const titleWords = post.title.toLowerCase().split(/\s+/).filter(word => word.length > 3)
  const contentPreview = post.content.substring(0, 500).toLowerCase()
  const contentWords = contentPreview.match(/\b\w{4,}\b/g) || []
  const topContentWords = [...new Set(contentWords)].slice(0, 10)

  // Comprehensive keywords
  const keywords = [
    post.title, // Full title
    ...titleWords, // Individual title words
    authorName, // Full author name
    firstName, // First name
    lastName, // Last name
    `${authorName} blog`,
    `${authorName} article`,
    `blog by ${authorName}`,
    post.category,
    ...post.tags,
    ...topContentWords, // Key terms from content
    'TIC Summit',
    'TIC Summit blog',
    'tech blog',
    'innovation blog',
    'Cameroon tech',
  ]

  return generateMetadata({
    title: `${post.title} by ${authorName}`,
    description,
    keywords,
    image,
    url,
    type: 'article',
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt,
    author: authorName,
    section: post.category,
    tags: post.tags,
  })
}

/**
 * Generate metadata for mentor profiles
 * Enhanced for name-based searchability
 */
export function generateMentorMetadata(mentor: {
  name: string
  bio?: string
  expertise?: string[]
  slug: string
  image?: string
  company?: string
  location?: string
  specialties?: string[]
}): Metadata {
  const url = `${SITE_URL}/mentors/${mentor.slug}`
  
  // Extract first and last name for better searchability
  const nameParts = mentor.name.trim().split(/\s+/)
  const firstName = nameParts[0] || mentor.name
  const lastName = nameParts[nameParts.length - 1] || mentor.name
  
  // Create comprehensive description with name prominently featured
  const description = mentor.bio 
    ? `${mentor.name} - ${mentor.bio.substring(0, 120)}...`
    : `${mentor.name} is an expert mentor at TIC Summit${mentor.company ? ` from ${mentor.company}` : ''}${mentor.location ? ` based in ${mentor.location}` : ''}. Learn from ${mentor.name} and discover their expertise in technology and innovation.`
  
  const image = mentor.image || DEFAULT_OG_IMAGE

  // Comprehensive keywords including name variations
  const keywords = [
    mentor.name, // Full name
    firstName, // First name
    lastName, // Last name
    `${firstName} ${lastName}`, // Full name again
    'mentor',
    'TIC Summit',
    'TIC Summit mentor',
    `${mentor.name} mentor`,
    `${mentor.name} TIC Summit`,
    ...(mentor.expertise || mentor.specialties || []),
    ...(mentor.company ? [mentor.company, `${mentor.name} ${mentor.company}`] : []),
    ...(mentor.location ? [mentor.location, `mentor ${mentor.location}`] : []),
    'tech mentor',
    'technology mentor',
    'innovation mentor',
    'Cameroon mentor',
  ]

  return generateMetadata({
    title: `${mentor.name} - TIC Summit Mentor`,
    description,
    keywords,
    image,
    url,
    type: 'profile',
  })
}

/**
 * Generate metadata for ambassador profiles
 * Enhanced for name-based searchability
 */
export function generateAmbassadorMetadata(ambassador: {
  name: string
  bio?: string
  school: string
  slug: string
  image?: string
}): Metadata {
  const url = `${SITE_URL}/ambassadors/${ambassador.slug}`
  
  // Extract first and last name for better searchability
  const nameParts = ambassador.name.trim().split(/\s+/)
  const firstName = nameParts[0] || ambassador.name
  const lastName = nameParts[nameParts.length - 1] || ambassador.name
  
  // Create comprehensive description with name prominently featured
  const description = ambassador.bio 
    ? `${ambassador.name} - ${ambassador.bio.substring(0, 120)}...`
    : `${ambassador.name} is a TIC Summit ambassador from ${ambassador.school}. ${ambassador.name} represents their school and promotes tech innovation among students in Cameroon.`
  
  const image = ambassador.image || DEFAULT_OG_IMAGE

  // Comprehensive keywords including name variations
  const keywords = [
    ambassador.name, // Full name
    firstName, // First name
    lastName, // Last name
    `${firstName} ${lastName}`, // Full name again
    'ambassador',
    'TIC Summit',
    'TIC Summit ambassador',
    `${ambassador.name} ambassador`,
    `${ambassador.name} TIC Summit`,
    ambassador.school,
    `${ambassador.name} ${ambassador.school}`,
    `ambassador ${ambassador.school}`,
    'student ambassador',
    'tech ambassador',
    'Cameroon ambassador',
  ]

  return generateMetadata({
    title: `${ambassador.name} - TIC Summit Ambassador`,
    description,
    keywords,
    image,
    url,
    type: 'profile',
  })
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TIC Summit',
    url: SITE_URL,
    logo: `${SITE_URL}/tic.ico`,
    description: "Cameroon's premier tech innovation program for Secondary and High school students.",
    foundingDate: '2020',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CM',
      },
    },
    sameAs: [
      'https://twitter.com/ticsummit',
      'https://facebook.com/ticsummit',
      'https://linkedin.com/company/ticsummit',
      'https://instagram.com/ticsummit',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@ticsummit.org',
    },
  }
}

/**
 * Generate JSON-LD structured data for Event
 */
export function generateEventSchema(eventData?: {
  name?: string
  startDate?: string
  endDate?: string
  location?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventData?.name || 'TIC Summit 2026',
    description: "Cameroon's premier tech innovation program for Secondary and High school students. Now in its 6th edition.",
    startDate: eventData?.startDate || '2026-03-15T09:00:00+01:00',
    endDate: eventData?.endDate || '2026-03-17T18:00:00+01:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: eventData?.location || 'Cameroon',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CM',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'TIC Summit',
      url: SITE_URL,
    },
    image: DEFAULT_OG_IMAGE,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/register`,
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate JSON-LD structured data for BlogPosting
 */
export function generateBlogPostSchema(post: BlogPostItem) {
  const url = `${SITE_URL}/blogs/${post.slug}`
  const image = post.image || DEFAULT_OG_IMAGE

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: image,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'TIC Summit Team',
      ...(post.author?.image && { image: post.author.image }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/tic.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category,
    keywords: [post.category, ...post.tags].join(', '),
    ...(post.readTime && { timeRequired: post.readTime }),
  }
}

/**
 * Generate JSON-LD structured data for Person (Mentor/Ambassador/Alumni/Team)
 */
export function generatePersonSchema(data: {
  name: string
  description?: string
  image?: string
  jobTitle?: string
  worksFor?: string
  url?: string
  sameAs?: string[]
  email?: string
  alumniOf?: string
  memberOf?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.image && { image: data.image }),
    ...(data.jobTitle && { jobTitle: data.jobTitle }),
    ...(data.worksFor && {
      worksFor: {
        '@type': 'Organization',
        name: data.worksFor,
      },
    }),
    ...(data.url && { url: data.url }),
    ...(data.email && { email: data.email }),
    ...(data.alumniOf && {
      alumniOf: {
        '@type': 'Organization',
        name: data.alumniOf,
      },
    }),
    ...(data.memberOf && {
      memberOf: {
        '@type': 'Organization',
        name: data.memberOf,
      },
    }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  }
}

/**
 * Generate JSON-LD structured data for Team Member
 */
export function generateTeamMemberSchema(member: {
  name: string
  role: string
  bio?: string
  image?: string
  email?: string
  linkedin?: string
  twitter?: string
  github?: string
  slug: string
}) {
  const url = `${SITE_URL}/team/${member.slug}`
  const sameAs: string[] = []
  if (member.linkedin) sameAs.push(member.linkedin)
  if (member.twitter) sameAs.push(member.twitter)
  if (member.github) sameAs.push(member.github)

  return generatePersonSchema({
    name: member.name,
    description: member.bio || `${member.name} is a ${member.role} at TIC Summit, working to empower young innovators across Cameroon.`,
    image: member.image,
    jobTitle: member.role,
    worksFor: 'TIC Summit',
    url,
    email: member.email,
    memberOf: 'TIC Summit',
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  })
}

/**
 * Generate JSON-LD structured data for Mentor
 */
export function generateMentorSchema(mentor: {
  name: string
  bio?: string
  specialties?: string[]
  company?: string
  location?: string
  image?: string
  slug: string
}) {
  const url = `${SITE_URL}/mentors/${mentor.slug}`
  const description = mentor.bio || `${mentor.name} is an expert mentor at TIC Summit${mentor.company ? ` from ${mentor.company}` : ''}${mentor.location ? ` based in ${mentor.location}` : ''}.`

  return generatePersonSchema({
    name: mentor.name,
    description,
    image: mentor.image,
    jobTitle: 'Mentor',
    worksFor: mentor.company || 'TIC Summit',
    url,
    memberOf: 'TIC Summit',
  })
}

/**
 * Generate JSON-LD structured data for Ambassador
 */
export function generateAmbassadorSchema(ambassador: {
  name: string
  bio?: string
  school: string
  image?: string
  slug: string
}) {
  const url = `${SITE_URL}/ambassadors/${ambassador.slug}`
  const description = ambassador.bio || `${ambassador.name} is a TIC Summit ambassador from ${ambassador.school}.`

  return generatePersonSchema({
    name: ambassador.name,
    description,
    image: ambassador.image,
    jobTitle: 'Student Ambassador',
    worksFor: ambassador.school,
    url,
    memberOf: 'TIC Summit',
  })
}

/**
 * Generate JSON-LD structured data for Alumni
 */
export function generateAlumniSchema(alumni: {
  name: string
  bio?: string
  image?: string
  slug: string
}) {
  const url = `${SITE_URL}/alumni/${alumni.slug}`
  const description = alumni.bio || `${alumni.name} is a TIC Summit alumnus who has gone on to achieve great things in technology.`

  return generatePersonSchema({
    name: alumni.name,
    description,
    image: alumni.image,
    url,
    alumniOf: 'TIC Summit',
  })
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate WebSite structured data with SearchAction
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

