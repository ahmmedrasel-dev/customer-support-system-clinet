"use client";

import React from "react";

export default function AdminHeader({
  user,
  onLogout,
}: {
  user: { name: string; email: string; role: string };
  onLogout: () => void;
}) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-slate-100">
          Admin Panel
        </span>
        <span className="text-sm text-slate-400">({user.role})</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-200">{user.name}</span>
        <span className="text-slate-400 text-xs">{user.email}</span>
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
