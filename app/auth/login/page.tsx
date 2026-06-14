"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl] = useState(() => {
    if (typeof window === "undefined") return "/";
    const params = new URLSearchParams(window.location.search);
    return params.get("callbackUrl") ?? "/";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(result?.url || callbackUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-gradient-to-br from-primary via-[#66153c] to-dark p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-2xl font-extrabold tracking-[0.24em]">Sareeva</p>
            <h1 className="mt-10 text-4xl font-bold leading-tight">Welcome back to timeless drapes and festive edits.</h1>
          </div>
          <p className="text-sm text-white/70">Sign in to track orders, save wishlists, and manage your seller storefront.</p>
        </div>
        <div className="p-8 sm:p-10">
          <p className="text-2xl font-extrabold tracking-[0.24em] text-primary lg:hidden">Sareeva</p>
          <h2 className="mt-4 text-3xl font-bold text-dark">Welcome back</h2>
          <p className="mt-2 text-sm text-zinc-500">Sign in to continue your saree shopping journey.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
            <Button variant="accent" size="lg" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
          </form>
          <div className="mt-6 space-y-3 text-sm text-zinc-500">
            <p>Don&apos;t have an account? <Link href="/auth/register" className="font-semibold text-primary">Create one</Link></p>
            <p>Continue as Seller? <Link href="/auth/register" className="font-semibold text-primary">Register as seller</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
