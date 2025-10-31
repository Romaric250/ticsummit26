"use client"

import { motion } from "framer-motion"
import { Home, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import Layout from "@/components/layout/Layout"

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <h1 className="text-9xl font-bold text-gray-900 leading-none">
                4<span className="text-gray-300">0</span>4
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Oops! The page you're looking for doesn't exist.
              </p>
              <p className="text-gray-500">
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Go Home
                </Button>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600 mb-4">Or visit these pages:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Blog
                </Link>
                <Link
                  href="/hall-of-fame"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Hall of Fame
                </Link>
                <Link
                  href="/schedule26"
                  className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                >
                  Schedule
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

