"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUp
} from "lucide-react"
import { Button } from "@/components/ui/Button"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const footerLinks = {
    about: [
      { name: "Our Story", href: "/about" },
      { name: "Mission & Vision", href: "/about/mission" },
      { name: "Team", href: "/about/team" },
      { name: "Partners", href: "/about/partners" },
    ],
    events: [
      { name: "TIC Summit 2025", href: "/events/2025" },
      { name: "Workshops", href: "/events/workshops" },
      { name: "Past Events", href: "/events/past" },
      { name: "Gallery", href: "/gallery" },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-lg">T</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl text-white">TIC Summit</span>
                    <span className="text-white text-sm">Innovation Hub</span>
                  </div>
                </Link>
                
                <p className="text-white mb-6 max-w-md">
                  Empowering young innovators across Cameroon through technology, 
                  mentorship, and hands-on learning experiences. Join us in building 
                  the future of African tech.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-white">
                    <MapPin className="w-5 h-5 text-white" />
                    <span>Yaoundé, Cameroon</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <Mail className="w-5 h-5 text-white" />
                    <span>info@ticsummit.org</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <Phone className="w-5 h-5 text-white" />
                    <span>+237 XXX XXX XXX</span>
                  </div>
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
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-white text-sm">
                © 2024 TIC Summit. All rights reserved.
              </div>
              
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

              {/* Back to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-white transition-colors duration-200"
              >
                <ArrowUp className="w-4 h-4 text-gray-900" />
                <span className="text-sm text-gray-900">Back to Top</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer