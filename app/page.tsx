import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { ClubStats } from "@/components/landing/club-stats";
import { UpcomingEvents } from "@/components/landing/upcoming-events";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <ClubStats />
      <UpcomingEvents />
    </main>
  );
}