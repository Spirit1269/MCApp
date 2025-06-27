// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchMembers, fetchEvents, fetchClubs, Event, Member, Club } from "@/lib/api";

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    fetchMembers().then(setMembers);
    fetchEvents().then(setEvents);
    fetchClubs().then(setClubs);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Club Dashboard</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold">Members ({members.length})</h2>
        <ul className="list-disc ml-6">
          {members.map((m: any) => (
            <li key={m.id}>{m.name} ({m.role})</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold">Events ({events.length})</h2>
        <ul className="list-disc ml-6">
          {events.map((e: any) => (
            <li key={e.id}>{e.title} — {e.date}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Clubs ({clubs.length})</h2>
        <ul className="list-disc ml-6">
          {clubs.map((c: any) => (
            <li key={c.id}>{c.name} ({c.city})</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
