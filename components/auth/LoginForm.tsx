"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || data?.error || "Login failed");
        return;
      }
      login(data.access_token, data.user);
      toast.success(data?.message || "Login successful!");
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
  );
}
