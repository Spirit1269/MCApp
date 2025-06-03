"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Users, 
  FileText, 
  Shield
} from "lucide-react";

export function Features() {
  const features = [
    {
      name: "Member Management",
      description: "Keep track of your entire club membership with detailed profiles and contact information.",
      icon: Users,
    },
    {
      name: "Event Calendar",
      description: "Schedule and organize club meetings, rides, and social gatherings.",
      icon: Calendar,
    },
    {
      name: "Dues Tracking",
      description: "Seamlessly collect and manage membership dues with integrated payment processing.",
      icon: CreditCard,
    },
    {
      name: "Ride Planning",
      description: "Create, share, and navigate detailed ride routes with integrated mapping.",
      icon: MapPin,
    },
    {
      name: "Chapter Communication",
      description: "Post announcements and share information with members at all levels.",
      icon: FileText,
    },
    {
      name: "Role-Based Access",
      description: "Secure access control with customizable permissions for officers and members.",
      icon: Shield,
    },
  ];

  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-chart-1">CLUB MANAGEMENT</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to run your motorcycle club
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our comprehensive platform provides all the tools you need to manage your 
            motorcycle club efficiently, from membership tracking to ride planning.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}