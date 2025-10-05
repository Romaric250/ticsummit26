import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TIC Summit - Technology Innovation Conference',
  description: 'Cameroon\'s premier tech innovation program for Secondary and High school students. Now in its 6th edition, TIC Summit connects young minds with industry experts and celebrates innovative ideas.',
  keywords: [
    'technology conference',
    'innovation summit',
    'tech education',
    'student tech challenge',
    'Cameroon tech',
    'secondary school tech',
    'high school innovation',
    'tech mentorship',
    'student projects',
    'technology education'
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
    title: 'TIC Summit - Technology Innovation Conference',
    description: 'Cameroon\'s premier tech innovation program for Secondary and High school students. Now in its 6th edition, TIC Summit connects young minds with industry experts.',
    url: 'https://ticsummit.org',
    siteName: 'TIC Summit',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TIC Summit - Technology Innovation Conference',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIC Summit - Technology Innovation Conference',
    description: 'Cameroon\'s premier tech innovation program for Secondary and High school students. Now in its 6th edition.',
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
  name: 'TIC Summit 2025',
  description: 'Technology Innovation Conference - Cameroon\'s premier tech innovation program for Secondary and High school students. Now in its 6th edition.',
  startDate: '2025-03-15T09:00:00+01:00',
  endDate: '2025-03-17T18:00:00+01:00',
  location: {
    '@type': 'Place',
    name: 'Cameroon',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CM',
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
