"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data for upcoming events
const mockEvents = [
  {
    id: "1",
    title: "Summer Ride to the Mountains",
    description: "Join us for a thrilling ride through scenic mountain routes with breathtaking views.",
    location: "Blue Ridge Mountains",
    date: new Date(2025, 5, 15),  // June 15, 2025
    time: "8:00 AM",
    duration: "6 hours",
    attendees: 28,
    organizer: {
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=1600",
      role: "Road Captain"
    },
    type: "Ride",
    image: "https://images.pexels.com/photos/2174752/pexels-photo-2174752.jpeg?auto=compress&cs=tinysrgb&w=1600"
  },
  {
    id: "2",
    title: "Monthly Chapter Meeting",
    description: "Regular chapter meeting to discuss upcoming events, club finances, and new member applications.",
    location: "The Rusty Spoke Clubhouse",
    date: new Date(2025, 4, 28),  // May 28, 2025
    time: "7:00 PM",
    duration: "2 hours",
    attendees: 45,
    organizer: {
      name: "Sarah Miller",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1600",
      role: "Chapter President"
    },
    type: "Meeting",
    image: "https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg?auto=compress&cs=tinysrgb&w=1600"
  },
  {
    id: "3",
    title: "Charity Poker Run",
    description: "Annual poker run to raise funds for the children's hospital. Registration fee includes lunch and t-shirt.",
    location: "Starting at City Park",
    date: new Date(2025, 6, 10),  // July 10, 2025
    time: "9:30 AM",
    duration: "5 hours",
    attendees: 65,
    organizer: {
      name: "Mike Wilson",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1600",
      role: "Vice President"
    },
    type: "Charity",
    image: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=1600"
  }
];

export function UpcomingEvents() {
  const [events] = useState(mockEvents);

  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-chart-1">UPCOMING EVENTS</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Join us on our next adventures
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Stay up to date with our latest rides, meetings, and social gatherings.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <Badge variant="secondary" className="bg-chart-1 text-white hover:bg-chart-1/90">
                      {event.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                    {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                  
                  <div className="mt-4 flex flex-col space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-chart-1" />
                      {format(event.date, "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-chart-1" />
                      {event.time} · {event.duration}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-chart-1" />
                      {event.attendees} attendees
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                      <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{event.organizer.name}</p>
                      <p className="text-xs text-muted-foreground">{event.organizer.role}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Details</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg">
            View All Events
            <Calendar className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}