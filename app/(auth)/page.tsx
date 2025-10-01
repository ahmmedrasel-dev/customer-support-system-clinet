import React from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-slate-100 mb-2">Sign in</h1>
        <p className="text-sm text-slate-300 mb-6">
          Enter your email and password to continue.
        </p>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-slate-300">
          Don’t have an account?{" "}
          <a href="/register" className="text-sky-400 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </main>
  );
}
