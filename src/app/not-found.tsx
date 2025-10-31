"use client"

import { motion } from "framer-motion"
import { Home } from "lucide-react"
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

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center items-center"
            >
              <Link href="/">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Go Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

