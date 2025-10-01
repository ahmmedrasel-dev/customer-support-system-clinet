"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      setSuccess(true);
    } catch (err: any) {
      setServerError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-slate-100 mb-2">Sign in</h1>
        <p className="text-sm text-slate-300 mb-6">
          Enter your email and password to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border rounded-md bg-slate-700 text-slate-100 border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              placeholder="you@example.com"
            />
            {errors.email && (
              <div className="text-sm text-red-400 mt-1">
                {errors.email.message}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full pr-12 px-3 py-2 border rounded-md bg-slate-700 text-slate-100 border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-slate-200 hover:text-slate-100"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <div className="text-sm text-red-400 mt-1">
                {errors.password.message}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-slate-300">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-sm text-sky-400 hover:underline">
              Forgot?
            </a>
          </div>

          {serverError && (
            <div className="text-sm text-red-400">{serverError}</div>
          )}
          {success && (
            <div className="text-sm text-green-400">Logged in (demo).</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

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
