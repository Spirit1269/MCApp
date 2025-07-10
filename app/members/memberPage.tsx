// app/members/memberPage.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchMembers, Member } from "@/lib/api";
import { toast } from "@/lib/toast-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers()
      .then((data) => setMembers(data))
      .catch((err) => {
        toast({ title: "Error loading members", description: err.message });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Loading members…</p>;
  }
  if (!members || members.length === 0) {
    return <p className="p-6 text-center">No members found.</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Club Members</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                {member.avatarUrl ? (
                  <AvatarImage src={member.avatarUrl} alt={member.ridingName} />
                ) : (
                  <AvatarFallback>
                    {member.ridingName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <CardTitle>
                {member.ridingName || `${member.firstName} ${member.lastName}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Email:</strong> {member.email}</p>
              {member.phoneNumber && (
                <p><strong>Phone:</strong> {member.phoneNumber}</p>
              )}
              <p><strong>Role:</strong> {member.role}</p>
              <p><strong>Status:</strong> {member.memberStatus}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
