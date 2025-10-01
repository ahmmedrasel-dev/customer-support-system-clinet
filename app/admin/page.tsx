"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Inbox,
  RefreshCw,
  CheckCircle,
  Archive,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  agent: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  date: string;
};

const initialTickets: Ticket[] = [
  {
    id: "TCK-1001",
    subject: "Cannot login to account",
    customer: "Alice Johnson",
    agent: "Sam",
    status: "Open",
    priority: "High",
    date: "2025-10-01",
  },
  {
    id: "TCK-1000",
    subject: "Payment not processed",
    customer: "Bob Martin",
    agent: "Priya",
    status: "In Progress",
    priority: "Medium",
    date: "2025-09-30",
  },
  {
    id: "TCK-0999",
    subject: "Feature request: export",
    customer: "Charlie Park",
    agent: "Mina",
    status: "Resolved",
    priority: "Low",
    date: "2025-09-28",
  },
  {
    id: "TCK-0998",
    subject: "Bug: UI overlap on mobile",
    customer: "Dana Lee",
    agent: "Sam",
    status: "Closed",
    priority: "Low",
    date: "2025-09-20",
  },
];

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

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
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2">Ticket</th>
                    <th className="px-3 py-2">Subject</th>
                    <th className="px-3 py-2">Customer</th>
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
                      <td className="px-3 py-2 max-w-xs truncate">
                        {t.subject}
                      </td>
                      <td className="px-3 py-2">{t.customer}</td>
                      <td className="px-3 py-2">{t.agent}</td>
                      <td className="px-3 py-2">
                        <span className="text-xs rounded-full px-2 py-1 bg-zinc-800 text-muted-foreground">
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            t.status === "Open"
                              ? "bg-red-100 text-red-800"
                              : t.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : t.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-zinc-700 text-gray-200"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {t.date}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/tickets/${t.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleNextStatus(t.id)}
                          >
                            Next Status
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
