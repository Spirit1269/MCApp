"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users as UsersIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { fetchEvents, Event } from "@/lib/api";

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents()
      .then((list) => setEvents(list))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error)
    return (
      <p className="text-center text-red-500">Error loading events: {error}</p>
    );

  if (events === null)
    return (
      <p className="text-center text-gray-500">Loading upcoming events…</p>
    );

  if (events.length === 0)
    return (
      <p className="text-center text-gray-400">
        No events available at the moment.
      </p>
    );

  return (
    <div className="bg-background py-24 sm:py-32">
      {/* header omitted for brevity */}
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
        {events.map((evt, idx) => {
          // parse the ISO string into Date
          const eventDate = new Date(evt.date);
          return (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full overflow-hidden">
                {/* image + badge */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <Badge
                      variant="secondary"
                      className="bg-chart-1 text-white hover:bg-chart-1/90"
                    >
                      {evt.type}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle>{evt.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                    {evt.location}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {evt.description}
                  </p>
                  <div className="mt-4 flex flex-col space-y-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-2 h-4 w-4 text-chart-1" />
                      {format(eventDate, "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-chart-1" />
                      {evt.time} · {evt.duration}
                    </div>
                    <div className="flex items-center text-sm">
                      <UsersIcon className="mr-2 h-4 w-4 text-chart-1" />
                      {evt.attendees} attendees
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-muted/50 p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={evt.organizer.avatar}
                        alt={evt.organizer.name}
                      />
                      <AvatarFallback>
                        {evt.organizer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {evt.organizer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {evt.organizer.role}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      {/* “View All Events” button omitted for brevity */}
    </div>
  );
}