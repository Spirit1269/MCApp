// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/** ─────── MEMBER / AUTH ─────── **/
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
  clubId: string;        // the ID of the club they belong to
  chapterId: string;    // specific chapter
  scopeId?: string;      // optional, used for events or specific scopes
  avatarUrl?: string;    // optional URL to their profile image
  joinedAt: string;      // ISO date string
  isApproved: boolean; // true if the member is approved
  isActive: boolean;   // true if the member is currently active  
}

// Fetch all members in a club
export async function fetchClubMembers(clubId: string) {
  const res = await fetch(`${API_BASE}/clubs/${clubId}/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

// Fetch all members in a chapter
export async function fetchMembersByChapter(chapterId: string) {
  const res = await fetch(`${API_BASE}/chapters/${chapterId}/members`);
  if (!res.ok) throw new Error(`Failed to fetch members for chapter ${chapterId}`);
  return res.json();
}

// Fetch a specific member by ID
export async function fetchMemberById(memberId: string): Promise<Member> {
  const res = await fetch(`${API_BASE}/members/${memberId}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch member (${res.status})`);
  }
  return res.json();
}

export async function fetchClubs() {
  const res = await fetch(`${API_BASE}/clubs`);
  if (!res.ok) throw new Error("Failed to fetch clubs");
  return res.json();
}
export async function fetchChaptersByClub(clubId: string) {
  const res = await fetch(`${API_BASE}/clubs/${clubId}/chapters`);
  if (!res.ok) throw new Error(`Failed to fetch chapters for club ${clubId}`);
  return res.json();
}

export async function createMember(member: Partial<Member>): Promise<Member> {
  const res = await fetch(`${API_BASE}/members`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...member,
      memberStatus: "Prospect",
      role: "Member",
      isApproved: false,
      joinedAt: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to create member (${res.status})`);
  }
  return res.json();
}
export async function fetchClubById(clubId: string): Promise<Club> {
  const res = await fetch(`${API_BASE}/clubs/${clubId}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch club (${res.status})`);
  }
  return res.json();
}
export async function fetchDuesInvoices(chapterId: string, clubId: string): Promise<DuesInvoice[]> {
  const res = await fetch(`${API_BASE}/dues/invoices`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch dues invoices");
  return res.json();
}
export async function approveMember(memberId: string) {
  const res = await fetch(`${API_BASE}/members/${memberId}/approve`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to approve member ${memberId}`);
  return res.json();
}
export async function createEvent(event: Partial<Event>): Promise<Event> {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...event,
      organizer: {
        name: "Club Organizer", // replace with actual organizer info
        avatar: "", // URL to organizer's avatar
        role: "Organizer", // replace with actual role
      },
      attendees: 0, // initial count
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to create event (${res.status})`);
  }
  return res.json();
}

export async function payDues(invoiceId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/dues/invoices/${invoiceId}/pay`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to pay dues invoice (${res.status})`);
  }
}
export async function fetchDuesInvoicesByMember(memberId: string): Promise<DuesInvoice[]> {
  const res = await fetch(`${API_BASE}/members/${memberId}/dues/invoices`, {
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Failed to fetch dues invoices for member (${res.status})`);
  }
  return res.json();
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
}
  

export interface Chapter {
  id: string;
  name: string;
  clubId: string; // ID of the parent club
  description?: string;
  city: string;
  state: string;
  createdAt: string;     // ISO date string
  isSetup: boolean;
  monthlyDuesCents: number;
  hasClubhouse: boolean; // true if the club has a clubhouse
  clubhouseAddress?: string; // address of the clubhouse if available
} 

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

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
  const data: Event[] = await res.json();
  return data;
}
