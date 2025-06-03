"use client";

import Link from "next/link";
import { useIsAuthenticated } from "@azure/msal-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, MapPin } from "lucide-react";

export function Hero() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="h-full w-full bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            backgroundPosition: "center 30%"
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">Motorcycle Club Hub</span>
            <span className="block text-chart-1">Ride Together. Thrive Together.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-xl text-gray-300 sm:max-w-3xl">
            The complete management platform for motorcycle clubs. Organize rides, track membership, and handle dues with ease.
          </p>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold">
                  <Link href="/login">
                    Join The Ride
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl bg-white/10 p-6 backdrop-blur-sm"
          >
            <Users className="h-12 w-12 text-chart-1" />
            <h3 className="mt-4 text-xl font-bold text-white">Member Management</h3>
            <p className="mt-2 text-gray-300">
              Track membership details, roles, and contact information.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl bg-white/10 p-6 backdrop-blur-sm"
          >
            <Calendar className="h-12 w-12 text-chart-1" />
            <h3 className="mt-4 text-xl font-bold text-white">Event Planning</h3>
            <p className="mt-2 text-gray-300">
              Organize club events, rides, and meetings with automatic notifications.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl bg-white/10 p-6 backdrop-blur-sm"
          >
            <MapPin className="h-12 w-12 text-chart-1" />
            <h3 className="mt-4 text-xl font-bold text-white">Ride Routes</h3>
            <p className="mt-2 text-gray-300">
              Plan and share detailed ride routes with turn-by-turn directions.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}