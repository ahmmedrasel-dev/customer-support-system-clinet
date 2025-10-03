"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Inbox,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  agent: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  date: string;
};
const initialTickets: Ticket[] = [];

export default function CustomerPage() {
  const { token, user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchUserTickets();
  }, [token]);

  const fetchUserTickets = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error('Failed to fetch tickets', res.status);
        setTickets([]);
        return;
      }
      const data = await res.json();
      // API returns either an array or { data: [...] }
      const arr: any[] = Array.isArray(data) ? data : (data.data || []);
      const sorted = arr
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((t) => ({
          id: String(t.id),
          subject: t.subject || 'No subject',
          customer: t.user?.name || user?.name || '',
          agent: t.assignedUser?.name || '',
          status: (t.status || 'Open') as Ticket['status'],
          priority: (t.priority || 'Low') as Ticket['priority'],
          date: t.created_at || t.createdAt || '',
        }));
      setTickets(sorted);
    } catch (err) {
      console.error('Error fetching user tickets', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };


  const counts = tickets.reduce(
    (acc, t) => {
      acc.total += 1;
      if (t.status === "Open") acc.open += 1;
      if (t.status === "In Progress") acc.inprogress += 1;
      if (t.status === "Resolved") acc.resolved += 1;
      if (t.status === "Closed") acc.closed += 1;
      return acc;
    },
    { total: 0, open: 0, inprogress: 0, resolved: 0, closed: 0 }
  );

  function toggleNextStatus(id: string) {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next: Record<string, Ticket["status"]> = {
          Open: "In Progress",
          "In Progress": "Resolved",
          Resolved: "Closed",
          Closed: "Closed",
        };
        return { ...t, status: next[t.status] };
      })
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Support Tickets</h1>
          <p className="text-sm text-muted-foreground">
            Overview of ticket activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost">Export</Button>
          <Link href="/admin/tickets/new">
            <Button>Create Ticket</Button>
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            key: "total",
            label: "Total",
            icon: Inbox,
            accent: "bg-gradient-to-br from-indigo-500 to-violet-500",
            delta: "+12",
          },
          {
            key: "open",
            label: "Open",
            icon: Inbox,
            accent: "bg-red-500",
            delta: "+3",
          },
          {
            key: "inprogress",
            label: "In Progress",
            icon: RefreshCw,
            accent: "bg-yellow-500",
            delta: "+1",
          },
          {
            key: "resolved",
            label: "Resolved",
            icon: CheckCircle,
            accent: "bg-green-500",
            delta: "+6",
          },
          {
            key: "closed",
            label: "Closed",
            icon: Archive,
            accent: "bg-zinc-600",
            delta: "+10",
          },
        ].map((m) => {
          const Icon = m.icon as React.ComponentType<any>;
          const value = (counts as Record<string, number>)[m.key] ?? 0;
          const positive = String(m.delta).startsWith("+");
          return (
            <Card key={m.key} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${m.accent} text-white shadow-md`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {m.label}
                    </div>
                    <div className="mt-1 text-2xl font-bold">{value}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    vs last period
                  </div>
                  <div
                    className={`mt-1 inline-flex items-center text-sm font-medium ${
                      positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {positive ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    <span className="ml-1">{m.delta}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loading && <div className="p-4">Loading your recent tickets...</div>}
              {!loading && tickets.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">You have no recent tickets.</div>
              )}
              {!loading && tickets.length > 0 && (
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="px-3 py-2">Ticket</th>
                      <th className="px-3 py-2">Subject</th>
                      <th className="px-3 py-2">Agent</th>
                      <th className="px-3 py-2">Priority</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id} className="border-t">
                        <td className="px-3 py-2 font-medium">{t.id}</td>
                        <td className="px-3 py-2 max-w-xs truncate">{t.subject}</td>
                        <td className="px-3 py-2">{t.agent}</td>
                        <td className="px-3 py-2">
                          <span className="text-xs rounded-full px-2 py-1 bg-zinc-800 text-muted-foreground">{t.priority}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            t.status === "Open"
                              ? "bg-red-100 text-red-800"
                              : t.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : t.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-zinc-700 text-gray-200"
                          }`}>{t.status}</span>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{t.date}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/tickets/${t.id}`}>
                              <Button variant="ghost" size="sm">View</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/tickets">
              <Button variant="ghost">View all tickets</Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
