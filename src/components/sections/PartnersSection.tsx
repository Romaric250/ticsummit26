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

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                  <div className="w-full h-48 p-6 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : partners.length === 0 ? null : (
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
                      className="group flex flex-col items-center justify-center w-full h-48 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <div className="relative w-full h-32 mb-3">
                        <Image
                          src={partner.logoUrl}
                          alt={partner.name}
                          fill
                          className="object-contain transition-all"
                        />
                      </div>
                      {showNames && (
                        <p className="text-base font-medium text-gray-700 mt-2 text-center group-hover:text-gray-900">
                          {partner.name}
                        </p>
                      )}
                    </a>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-48 p-6 bg-gray-50 rounded-lg">
                      <div className="relative w-full h-32 mb-3">
                        <Image
                          src={partner.logoUrl}
                          alt={partner.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {showNames && (
                        <p className="text-base font-medium text-gray-700 mt-2 text-center">
                          {partner.name}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PartnersSection

