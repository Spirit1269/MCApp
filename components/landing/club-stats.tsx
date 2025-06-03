"use client";

import { motion } from "framer-motion";
import { Users, MapPin, Calendar, CreditCard } from "lucide-react";

export function ClubStats() {
  const stats = [
    { name: "Active Members", value: "500+", icon: Users },
    { name: "Chapters Nationwide", value: "25", icon: MapPin },
    { name: "Annual Events", value: "120+", icon: Calendar },
    { name: "Dues Collected", value: "$50K+", icon: CreditCard },
  ];

  return (
    <div className="bg-chart-3 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by motorcycle clubs across the country
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Our platform helps motorcycle clubs of all sizes streamline their operations.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col bg-white/5 p-8 backdrop-blur-sm"
              >
                <dt className="text-sm font-semibold leading-6 text-gray-300 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 mr-2 text-chart-1" />
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}