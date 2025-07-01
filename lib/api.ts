// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-backend-url/api";

export async function fetchMembers() {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export async function fetchClubs() {
  const res = await fetch(`${API_BASE}/clubs`);
  if (!res.ok) throw new Error("Failed to fetch clubs");
  return res.json();
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  ridingName: string;
  phoneNumber?: string; // optional, can be undefined
  birthday?: string;   // optional, ISO date string
  email: string;
  typeOfBike?: string; // optional, e.g. "Cruiser", "Sport", etc.
  memberStatus: string; // e.g. "Active", "Inactive", "Prospect"
  role: string;          // e.g. "Chapter President", "Road Captain", etc.
  clubId: string;        // the ID of the club/chapter they belong to
  avatarUrl?: string;    // optional URL to their profile image
  joinedAt: string;      // ISO date string
  
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  city: string;
  state: string;
  logoUrl?: string;      // URL to the club’s logo
  primaryColor?: string; // HEX, e.g. "#FF0000"
  secondaryColor?: string;
  createdAt: string;     // ISO date string
  isSetup: boolean;
  monthlyDuesCents: number;
  updatedAt?: string
  hasClubhouse: boolean; // true if the club has a clubhouse
  clubhouseAddress?: string; // address of the clubhouse if available
}

// lib/api.ts
export interface Event {
  id: string;
  scopeId: string
  scopeType: string
  title: string;
  description: string;
  location: string;
  date: string;       // as returned by your API
  time: string;
  duration: string;
  attendees: number;
  type: string;
  image: string;
  flyerUrl?: string
  startsAt: string
  endsAt: string
  organizer: {
    name: string;
    avatar: string;
    role: string;
  };
}

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${BASE}/events`);
  if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
  const data: Event[] = await res.json();
  return data;
}
