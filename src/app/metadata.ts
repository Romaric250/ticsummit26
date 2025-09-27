import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TIC Summit 2024 - Technology Innovation Conference',
  description: 'Join the premier technology innovation conference featuring industry leaders, hands-on workshops, and cutting-edge insights. March 15-17, 2024 in San Francisco.',
  keywords: [
    'technology conference',
    'innovation summit',
    'tech event',
    'AI conference',
    'software development',
    'startup conference',
    'San Francisco tech',
    'developer conference',
    'tech networking',
    'technology trends'
  ],
  authors: [{ name: 'TIC Summit Team' }],
  creator: 'TIC Summit',
  publisher: 'TIC Summit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ticsummit.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TIC Summit 2024 - Technology Innovation Conference',
    description: 'Join the premier technology innovation conference featuring industry leaders, hands-on workshops, and cutting-edge insights. March 15-17, 2024 in San Francisco.',
    url: 'https://ticsummit.org',
    siteName: 'TIC Summit',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TIC Summit 2024 - Technology Innovation Conference',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIC Summit 2024 - Technology Innovation Conference',
    description: 'Join the premier technology innovation conference featuring industry leaders, hands-on workshops, and cutting-edge insights.',
    images: ['/twitter-image.jpg'],
    creator: '@ticsummit',
    site: '@ticsummit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
}

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'TIC Summit 2024',
  description: 'Technology Innovation Conference featuring industry leaders, hands-on workshops, and cutting-edge insights.',
  startDate: '2024-03-15T09:00:00-08:00',
  endDate: '2024-03-17T18:00:00-08:00',
  location: {
    '@type': 'Place',
    name: 'San Francisco Convention Center',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '747 Howard St',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94103',
      addressCountry: 'US',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'TIC Summit',
    url: 'https://ticsummit.org',
  },
  offers: {
    '@type': 'Offer',
    price: '299',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://ticsummit.org/register',
  },
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
}
