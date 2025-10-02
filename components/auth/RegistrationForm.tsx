"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

type Props = {
  onSuccess?: () => void;
};

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data: any) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export default function RegistrationForm({ onSuccess }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || data?.error || "Registration failed");
        return;
      }
      // Don't store token immediately, let user login instead
      toast.success(
        data?.message ||
          "Registration successful! Please log in with your credentials."
      );

      // Navigate to login page after successful registration
      router.push("/");

      onSuccess?.();
    } catch (err: any) {
      setServerError(err?.message || "Request failed");
      // Only show toast if fetch itself fails (network error)
      toast.error(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full bg-slate-800 border border-slate-700 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-slate-100 mb-2">
          Create an account
        </h2>
        <p className="text-sm text-slate-300 mb-6">
          Enter your details to create a new account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full px-3 py-2 border rounded-md bg-slate-700 text-slate-100 border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              placeholder="Your full name"
            />
            {errors.name && (
              <div className="text-sm text-red-400 mt-1">
                {errors.name.message}
              </div>
            )}
          </div>

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
                placeholder="Create a password"
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

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-slate-200 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirm"
              {...register("confirm")}
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border rounded-md bg-slate-700 text-slate-100 border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              placeholder="Repeat your password"
            />
            {errors.confirm && (
              <div className="text-sm text-red-400 mt-1">
                {errors.confirm.message}
              </div>
            )}
          </div>

          {serverError && (
            <div className="text-sm text-red-400">{serverError}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/" className="text-sky-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
