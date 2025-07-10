// app/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchClubs, fetchChaptersByClub, createMember, Club, Chapter } from "@/lib/api";
import { toast } from "@/lib/toast-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [ridingName, setRidingName] = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [birthday, setBirthday]   = useState("");
  const [bike, setBike]           = useState("");
  const [clubs, setClubs]         = useState<Club[]>([]);
  const [clubId, setClubId]       = useState("");
  const [chapters, setChapters]   = useState<Chapter[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClubs().then(setClubs).catch(err => toast({ title: "Error", description: err.message }));
  }, []);

  useEffect(() => {
    if (!clubId) {
      setChapters([]);
      return;
    }
    fetchChaptersByClub(clubId)
      .then(setChapters)
      .catch(err => toast({ title: "Error loading chapters", description: err.message }));
  }, [clubId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createMember({
        firstName,
        lastName,
        ridingName,
        email,
        phoneNumber: phone,
        birthday,
        typeOfBike: bike,
        clubId,
        chapterId,
      });
      toast({ title: "Request submitted", description: "An officer will review your profile soon." });
      // Optionally clear form:
      setFirstName("");
      setLastName("");
      setRidingName("");
      setEmail("");
      setPhone("");
      setBirthday("");
      setBike("");
      setClubId("");
      setChapterId("");
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Your Profile</h1>

      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" required value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" required value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="ridingName">Riding Name</Label>
        <Input id="ridingName" value={ridingName} onChange={e => setRidingName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="birthday">Birthday</Label>
        <Input id="birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="bike">Type of Bike</Label>
        <Input id="bike" value={bike} onChange={e => setBike(e.target.value)} />
      </div>

      <div>
        <Label>Club</Label>
        <Select value={clubId} onValueChange={setClubId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a club" />
          </SelectTrigger>
          <SelectContent>
            {clubs.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {chapters.length > 0 && (
        <div>
          <Label>Chapter</Label>
          <Select value={chapterId} onValueChange={setChapterId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map(ch => <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Submitting…" : "Submit Profile"}
      </Button>
    </form>
  );
}
