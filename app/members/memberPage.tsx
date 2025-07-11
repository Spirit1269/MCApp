// app/members/memberPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchClubMembers,
  fetchMembersByChapter,
  approveMember,
  Member
} from "@/lib/api";
import { toast } from "@/lib/toast-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapterId = searchParams.get("chapterId");
  const clubId = searchParams.get("clubId");

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!clubId && !chapterId) {
      toast({ title: "Error", description: "No club or chapter specified." });
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const data = chapterId
          ? await fetchMembersByChapter(chapterId)
          : await fetchClubMembers(clubId!);
        setMembers(data);
      } catch (err: any) {
        toast({ title: "Error loading members", description: err.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [clubId, chapterId]);

  const handleApprove = async (id: string) => {
    try {
      await approveMember(id);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, isApproved: true } : m));
      toast({ title: "Member approved" });
    } catch (err: any) {
      toast({ title: "Approval failed", description: err.message });
    }
  };

  if (loading) return <p className="p-6 text-center">Loading members…</p>;
  if (!members.length) return <p className="p-6 text-center">No members found.</p>;

  const pending = members.filter(m => !m.isApproved);
  const approved = members.filter(m => m.isApproved);

  return (
    <div className="p-6 space-y-8">
      {pending.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold">Pending Members</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map(member => (
              <Card key={member.id}>
                <CardHeader className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {member.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={member.ridingName} />
                    ) : (
                      <AvatarFallback>{member.ridingName.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <CardTitle>
                    {member.ridingName || `${member.firstName} ${member.lastName}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Email:</strong> {member.email}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleApprove(member.id)}>Approve</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {approved.length > 0 && (
        <>
          <h1 className="text-3xl font-bold">Members</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map(member => (
              <Card key={member.id}>
                <CardHeader className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {member.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={member.ridingName} />
                    ) : (
                      <AvatarFallback>{member.ridingName.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <CardTitle>
                    {member.ridingName || `${member.firstName} ${member.lastName}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p><strong>Email:</strong> {member.email}</p>
                  {member.phoneNumber && (<p><strong>Phone:</strong> {member.phoneNumber}</p>)}
                  <p><strong>Role:</strong> {member.role}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" onClick={() => router.push(`/members/${member.id}`)}>
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
// This page displays all members in a club or chapter, with pending members highlighted for approval.
// It uses the `fetchClubMembers` and `fetchMembersByChapter` functions to retrieve