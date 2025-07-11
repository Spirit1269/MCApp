// app/dashboard/officer/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "@/lib/toast-store";
import {
  fetchClubMembers,
  fetchEvents,
  fetchDuesInvoices,
  approveMember,
  createEvent,
  payDues,
  Member,
  Event,
  DuesInvoice
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Placeholder: in a real app, pull these from auth context
const CURRENT_CLUB_ID = "<club-id-from-token>";
const CURRENT_CHAPTER_ID = "<chapter-id-from-token>";

const sections = ["Approve Members", "Events", "Dues Invoices", "Members List"] as const;
type Section = typeof sections[number];

export default function OfficerDashboard() {
  const [section, setSection] = useState<Section>(sections[0]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [invoices, setInvoices] = useState<DuesInvoice[]>([]);
  const [loading, setLoading] = useState(false);

  // State for new event form
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: "", description: "", startsAt: "", endsAt: "", location: "" });

  useEffect(() => {
    setLoading(true);
    switch (section) {
      case "Approve Members":
      case "Members List":
        fetchClubMembers(CURRENT_CLUB_ID)
          .then(setMembers)
          .catch(err => toast({ title: "Error", description: err.message }))
          .finally(() => setLoading(false));
        break;

      case "Events":
        fetchEvents()
          .then(setEvents)
          .catch(err => toast({ title: "Error", description: err.message }))
          .finally(() => setLoading(false));
        break;

      case "Dues Invoices":
        fetchDuesInvoices(CURRENT_CHAPTER_ID, CURRENT_CLUB_ID)
          .then(setInvoices)
          .catch(err => toast({ title: "Error", description: err.message }))
          .finally(() => setLoading(false));
        break;
    }
  }, [section]);

  const handleApprove = async (id: string) => {
    try {
      await approveMember(id);
      toast({ title: "Member Approved" });
      setMembers(members.filter(m => m.id !== id));
    } catch (err: any) {
      toast({ title: "Approval Failed", description: err.message });
    }
  };

  const handleCreateEvent = async () => {
    try {
      await createEvent({ ...newEvent, scopeId: CURRENT_CLUB_ID, scopeType: "club" });
      toast({ title: "Event Created" });
      setNewEvent({ title: "", description: "", startsAt: "", endsAt: "", location: "" });
      setSection("Events");
    } catch (err: any) {
      toast({ title: "Create Event Failed", description: err.message });
    }
  };

  const handlePay = async (invoiceId: string) => {
    try {
      await payDues(invoiceId);
      toast({ title: "Invoice Paid" });
      setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    } catch (err: any) {
      toast({ title: "Payment Failed", description: err.message });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Officer Dashboard</h1>
      <div className="flex space-x-4">
        {sections.map(sec => (
          <Button
            key={sec}
            variant={section === sec ? "default" : "outline"}
            onClick={() => setSection(sec)}
          >
            {sec}
          </Button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {section === "Approve Members" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.filter(m => !m.isApproved).map(m => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle>{m.ridingName || `${m.firstName} ${m.lastName}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{m.email}</p>
                <p>Joined: {new Date(m.joinedAt).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleApprove(m.id)}>Approve</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {section === "Members List" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map(m => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle>{m.ridingName || `${m.firstName} ${m.lastName}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{m.email}</p>
                <p>Status: {m.isApproved ? "Approved" : "Pending"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {section === "Events" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(e => (
              <Card key={e.id}>
                <CardHeader>
                  <CardTitle>{e.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{new Date(e.startsAt).toLocaleString()}</p>
                  {e.location && <p>{e.location}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-semibold">Create New Event</h2>
            <div>
              <Label>Title</Label>
              <Input
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <div>
                <Label>Start</Label>
                <Input
                  type="datetime-local"
                  value={newEvent.startsAt}
                  onChange={e => setNewEvent({ ...newEvent, startsAt: e.target.value })}
                />
              </div>
              <div>
                <Label>End</Label>
                <Input
                  type="datetime-local"
                  value={newEvent.endsAt}
                  onChange={e => setNewEvent({ ...newEvent, endsAt: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </div>
        </div>
      )}

      {section === "Dues Invoices" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invoices.map(inv => (
            <Card key={inv.id}>
              <CardHeader>
                <CardTitle>{inv.period}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Amount: ${inv.amountCents / 100}</p>
                <p>Status: {inv.status}</p>
              </CardContent>
              <CardFooter>
                {inv.status !== "Paid" && (
                  <Button onClick={() => handlePay(inv.id)}>Mark as Paid</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
// Note: This is a simplified example. In a real app, you would likely want to add error handling, loading states, and possibly pagination for large lists.
// Also, ensure that the API endpoints and data structures match your backend implementation.