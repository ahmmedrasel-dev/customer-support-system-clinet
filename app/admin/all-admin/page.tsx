"use client";
import DevPlaceholder from "@/components/development";
import React from "react";

import { useEffect, useState } from "react";

type Admin = {
  id: number;
  name: string;
  email: string;
};

const AllAdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/admins`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch admins");
        const data = await res.json();
        setAdmins(data.data || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  if (loading)
    return (
      <DevPlaceholder
        title="Loading admins..."
        description="Please wait while we fetch the admin list."
      />
    );
  if (error) return <DevPlaceholder title="Error" description={error} />;
  if (!admins.length)
    return (
      <DevPlaceholder
        title="No admins found"
        description="There are no admin users in the system."
      />
    );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">All Admins</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {admins.map((admin) => (
          <li key={admin.id} className="py-4 flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
              {admin.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {admin.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {admin.email}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllAdminsPage;
