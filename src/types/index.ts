export interface Club {
  id: string;
  name: string;
  logoUrl: string;
  primaryHex: string;
  secondaryHex: string;
}

export interface District {
  id: string;
  name: string;
  clubId: string;
}

export interface Chapter {
  id: string;
  districtId: string;
  name: string;
  clubhouse: boolean;
}

export interface Member {
  id: string;
  chapterId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  avatarUrl: string | null;
  stripeCustomerId: string | null;
}

export type ScopeType = 'club' | 'district' | 'chapter';

export interface Role {
  id: string;
  memberId: string;
  roleName: string;
  scopeId: string;
  scopeType: ScopeType;
}

export interface Post {
  id: string;
  scopeId: string;
  scopeType: ScopeType;
  title: string;
  bodyMd: string;
  createdBy: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  scopeId: string;
  scopeType: ScopeType;
  title: string;
  descriptionMd: string;
  flyerUrl: string | null;
  startsAt: Date;
  endsAt: Date;
  createdBy: string;
}

export interface DuesInvoice {
  id: string;
  chapterId: string;
  period: string;
  amountCents: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  stripeInvoiceId: string | null;
}

export interface Payment {
  id: string;
  duesInvoiceId: string;
  amountCents: number;
  paidAt: Date;
}

export interface RideRoute {
  id: string;
  createdBy: string;
  title: string;
  startLat: number;
  startLng: number;
  distanceMi: number;
  gpxJson: string;
}