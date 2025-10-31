"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface Partner {
  id: string
  name: string
  logoUrl: string
  website?: string
}

const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showNames, setShowNames] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true)
        const [partnersRes, settingsRes] = await Promise.all([
          fetch("/api/content/partners"),
          fetch("/api/content/site-settings")
        ])

        if (partnersRes.ok) {
          const partnersData = await partnersRes.json()
          if (partnersData.success) {
            setPartners(partnersData.data)
          }
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          if (settingsData.success && settingsData.data) {
            setShowNames(settingsData.data.showPartnerNames !== false)
          }
        }
      } catch (error) {
        console.error("Error fetching partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  if (loading || partners.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're proud to work with leading organizations that support innovation and education
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center justify-center"
              >
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center w-full h-32 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="relative w-full h-20 mb-2">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        className="object-contain filter grayscale hover:grayscale-0 transition-all"
                      />
                    </div>
                    {showNames && (
                      <p className="text-sm font-medium text-gray-700 mt-2 text-center group-hover:text-gray-900">
                        {partner.name}
                      </p>
                    )}
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-32 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-full h-20 mb-2">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        className="object-contain filter grayscale"
                      />
                    </div>
                    {showNames && (
                      <p className="text-sm font-medium text-gray-700 mt-2 text-center">
                        {partner.name}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection

