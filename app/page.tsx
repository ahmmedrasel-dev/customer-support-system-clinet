"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page when accessing the main domain
    router.push("/login");
  }, [router]);

  return null; // No content as it redirects immediately
}