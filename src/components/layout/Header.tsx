"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { AuthButton } from "@/components/auth/AuthButton"
import { useSession } from "@/lib/auth-client"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check if we should animate (only on first load, persisted across route changes)
  const shouldAnimate = typeof window !== 'undefined' && !sessionStorage.getItem('headerAnimated')
  
  useEffect(() => {
    if (shouldAnimate && typeof window !== 'undefined') {
      sessionStorage.setItem('headerAnimated', 'true')
    }
  }, [shouldAnimate])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Techgirls", href: "/techgirls-mentorship" },
    { name: "Mentors", href: "/mentors" },
    { name: "Team", href: "/team" },
    { name: "Hall of Fame", href: "/hall-of-fame" },
    { name: "Blogs", href: "/blog" },
    { 
      name: "More", 
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "Schedule26", href: "/schedule26" },
        { name: "Ambassadors", href: "/ambassadors" },
        { name: "Alumni", href: "/alumni" },
        ...((session?.user as any)?.role === "ADMIN" ? [{ name: "Admin Dashboard", href: "/admin" }] : [])
      ]
    },
  ]

  return (
    <motion.header
      initial={shouldAnimate ? { y: -100 } : false}
      animate={{ y: 0 }}
      transition={shouldAnimate ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-10 w-auto"
              style={{ width: 'auto', minWidth: '120px' }}
            >
              <Image
                src="https://2d4r8xyx2f.ufs.sh/f/NBqaoz7VhueJfNgKY3syseo1qmkclSJ8WhTOv7rNj6uD5A3i"
                alt="TIC Summit Logo"
                width={120}
                height={40}
                className="object-contain"
                priority
                unoptimized
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 transition-colors relative ${
                    pathname === item.href 
                      ? 'text-white bg-white/10 rounded-lg font-semibold text-base' 
                      : 'text-white hover:text-white text-base'
                  }`}
                  onMouseEnter={() => item.hasDropdown && setIsMoreOpen(true)}
                  onMouseLeave={() => item.hasDropdown && setIsMoreOpen(false)}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isMoreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                        onMouseEnter={() => setIsMoreOpen(true)}
                        onMouseLeave={() => setIsMoreOpen(false)}
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Elements */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Auth Button */}
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md transition-colors text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-white/20 rounded-b-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-gray-500 font-medium text-sm">
                          {item.name}
                        </div>
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-6 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 space-y-3 border-t border-gray-200">
                  <div className="px-3">
                    <AuthButton />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header