"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/Button"

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    address: "Yaoundé, Cameroon",
    email: "info@ticsummit.org",
    phone: "+237 XXX XXX XXX"
  })

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/content/contact-info")
        const data = await response.json()
        if (data.success && data.data) {
          setContactInfo(data.data)
        }
      } catch (error) {
        console.error("Error fetching contact info:", error)
      }
    }
    fetchContactInfo()
  }, [])
  const footerLinks = {
    about: [
      { name: "Our Story", href: "/about" },
      { name: "Mission & Vision", href: "/about" },
      { name: "Team", href: "/about" },
      { name: "Partners", href: "/" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Resources", href: "/resources" },
      { name: "Hall of Fame", href: "/hall-of-fame" },
      { name: "FAQ", href: "/faq" },
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "Volunteer", href: "/volunteer" },
      { name: "Donate", href: "/donate" },
      { name: "Sponsor", href: "/sponsor" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/ticsummit" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/ticsummit" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/ticsummit" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/ticsummit" },
  ]

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gray-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center mb-6">
                  <div className="relative h-12 w-auto" style={{ width: 'auto', minWidth: '150px' }}>
                    <Image
                      src="https://2d4r8xyx2f.ufs.sh/f/NBqaoz7VhueJfNgKY3syseo1qmkclSJ8WhTOv7rNj6uD5A3i"
                      alt="TIC Summit Logo"
                      width={150}
                      height={48}
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                </Link>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-white">
                    <MapPin className="w-5 h-5 text-white" />
                    <span>{contactInfo.address}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <Mail className="w-5 h-5 text-white" />
                    <button
                      onClick={async () => {
                        try {
                          const contactRes = await fetch("/api/content/contact-info")
                          const contactData = await contactRes.json()
                          const email = contactData.success && contactData.data 
                            ? contactData.data.email 
                            : contactInfo.email
                          
                          const subject = encodeURIComponent("Contact Inquiry - TIC Summit")
                          const body = encodeURIComponent(
                            "Hello TIC Summit Team,\n\n" +
                            "I would like to get in touch with you regarding TIC Summit.\n\n" +
                            "Please provide me with more information.\n\n" +
                            "Thank you,\n[Your Name]"
                          )
                          window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                        } catch (error) {
                          // Fallback to default email
                          const subject = encodeURIComponent("Contact Inquiry - TIC Summit")
                          const body = encodeURIComponent(
                            "Hello TIC Summit Team,\n\n" +
                            "I would like to get in touch with you regarding TIC Summit.\n\n" +
                            "Please provide me with more information.\n\n" +
                            "Thank you,\n[Your Name]"
                          )
                          window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
                        }
                      }}
                      className="hover:underline cursor-pointer transition-colors duration-200"
                    >
                      {contactInfo.email}
                    </button>
                  </div>
                  {contactInfo.phone && (
                    <div className="flex items-center space-x-3 text-white">
                      <Phone className="w-5 h-5 text-white" />
                      <button
                        onClick={async () => {
                          try {
                            const contactRes = await fetch("/api/content/contact-info")
                            const contactData = await contactRes.json()
                            const email = contactData.success && contactData.data 
                              ? contactData.data.email 
                              : contactInfo.email
                            
                            const subject = encodeURIComponent("Contact Inquiry - TIC Summit")
                            const body = encodeURIComponent(
                              "Hello TIC Summit Team,\n\n" +
                              "I would like to contact you regarding TIC Summit.\n\n" +
                              "Please reach out to me at your earliest convenience.\n\n" +
                              "Thank you,\n[Your Name]"
                            )
                            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                          } catch (error) {
                            // Fallback to default email
                            const subject = encodeURIComponent("Contact Inquiry - TIC Summit")
                            const body = encodeURIComponent(
                              "Hello TIC Summit Team,\n\n" +
                              "I would like to contact you regarding TIC Summit.\n\n" +
                              "Please reach out to me at your earliest convenience.\n\n" +
                              "Thank you,\n[Your Name]"
                            )
                            window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
                          }
                        }}
                        className="hover:underline cursor-pointer transition-colors duration-200"
                      >
                        {contactInfo.phone}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-lg mb-4 capitalize text-white">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => {
                    // Handle Contact Us button specially
                    if (link.name === "Contact Us") {
                      return (
                        <li key={link.name}>
                          <button
                            onClick={async () => {
                              try {
                                const contactRes = await fetch("/api/content/contact-info")
                                const contactData = await contactRes.json()
                                const email = contactData.success && contactData.data 
                                  ? contactData.data.email 
                                  : "info@ticsummit.org"
                                
                                const subject = encodeURIComponent("Contact Inquiry - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I would like to get in touch with you regarding TIC Summit.\n\n" +
                                  "Please provide me with more information.\n\n" +
                                  "Thank you,\n[Your Name]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              } catch (error) {
                                // Fallback to default email
                                const email = "info@ticsummit.org"
                                const subject = encodeURIComponent("Contact Inquiry - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I would like to get in touch with you regarding TIC Summit.\n\n" +
                                  "Please provide me with more information.\n\n" +
                                  "Thank you,\n[Your Name]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              }
                            }}
                            className="text-white hover:text-white transition-colors duration-200 cursor-pointer"
                          >
                            {link.name}
                          </button>
                        </li>
                      )
                    }

                    // Handle Donate button specially
                    if (link.name === "Donate") {
                      return (
                        <li key={link.name}>
                          <button
                            onClick={async () => {
                              try {
                                const contactRes = await fetch("/api/content/contact-info")
                                const contactData = await contactRes.json()
                                const email = contactData.success && contactData.data 
                                  ? contactData.data.email 
                                  : "info@ticsummit.org"
                                
                                const subject = encodeURIComponent("Donation Inquiry - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I am interested in making a donation to support your mission of empowering young innovators in Cameroon.\n\n" +
                                  "Please provide me with more information about how I can contribute.\n\n" +
                                  "Thank you,\n[Your Name]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              } catch (error) {
                                // Fallback to default email
                                const email = "info@ticsummit.org"
                                const subject = encodeURIComponent("Donation Inquiry - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I am interested in making a donation to support your mission of empowering young innovators in Cameroon.\n\n" +
                                  "Please provide me with more information about how I can contribute.\n\n" +
                                  "Thank you,\n[Your Name]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              }
                            }}
                            className="text-white hover:text-white transition-colors duration-200 cursor-pointer"
                          >
                            {link.name}
                          </button>
                        </li>
                      )
                    }

                    // Handle Sponsor button specially
                    if (link.name === "Sponsor") {
                      return (
                        <li key={link.name}>
                          <button
                            onClick={async () => {
                              try {
                                const contactRes = await fetch("/api/content/contact-info")
                                const contactData = await contactRes.json()
                                const email = contactData.success && contactData.data 
                                  ? contactData.data.email 
                                  : "info@ticsummit.org"
                                
                                const subject = encodeURIComponent("Sponsorship Inquiry - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I am interested in becoming a sponsor for TIC Summit to support your mission of empowering young innovators in Cameroon.\n\n" +
                                  "Please provide me with more information about sponsorship opportunities and how my organization can contribute.\n\n" +
                                  "Thank you,\n[Your Name/Organization]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              } catch (error) {
                                // Fallback to default email
                                const email = "info@ticsummit.org"
                                const subject = encodeURIComponent("Sponsorship Inquiry - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I am interested in becoming a sponsor for TIC Summit to support your mission of empowering young innovators in Cameroon.\n\n" +
                                  "Please provide me with more information about sponsorship opportunities and how my organization can contribute.\n\n" +
                                  "Thank you,\n[Your Name/Organization]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              }
                            }}
                            className="text-white hover:text-white transition-colors duration-200 cursor-pointer"
                          >
                            {link.name}
                          </button>
                        </li>
                      )
                    }

                    // Handle Volunteer button specially
                    if (link.name === "Volunteer") {
                      return (
                        <li key={link.name}>
                          <button
                            onClick={async () => {
                              try {
                                const contactRes = await fetch("/api/content/contact-info")
                                const contactData = await contactRes.json()
                                const email = contactData.success && contactData.data 
                                  ? contactData.data.email 
                                  : "info@ticsummit.org"
                                
                                const subject = encodeURIComponent("Volunteer Application - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I am interested in volunteering for TIC Summit to support your mission of empowering young innovators in Cameroon.\n\n" +
                                  "Please provide me with more information about volunteer opportunities and how I can contribute to the summit.\n\n" +
                                  "Thank you,\n[Your Name]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              } catch (error) {
                                // Fallback to default email
                                const email = "info@ticsummit.org"
                                const subject = encodeURIComponent("Volunteer Application - TIC Summit")
                                const body = encodeURIComponent(
                                  "Hello TIC Summit Team,\n\n" +
                                  "I am interested in volunteering for TIC Summit to support your mission of empowering young innovators in Cameroon.\n\n" +
                                  "Please provide me with more information about volunteer opportunities and how I can contribute to the summit.\n\n" +
                                  "Thank you,\n[Your Name]"
                                )
                                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
                              }
                            }}
                            className="text-white hover:text-white transition-colors duration-200 cursor-pointer"
                          >
                            {link.name}
                          </button>
                        </li>
                      )
                    }
                    
                    // For other links, navigate normally - 404 page will catch non-existent pages
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white hover:bg-white transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5 text-gray-900" />
                </motion.a>
              ))}
            </div>
            
            <div className="text-white text-sm">
              © 2025 TIC Summit. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer