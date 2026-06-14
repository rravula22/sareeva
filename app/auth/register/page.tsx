"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "BUYER",
    storeName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to register.");
      router.push("/auth/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-xl sm:p-10 lg:p-12">
        <p className="text-2xl font-extrabold tracking-[0.24em] text-primary">Sareeva</p>
        <h1 className="mt-4 text-3xl font-bold text-dark">Create your account</h1>
        <p className="mt-2 text-sm text-zinc-500">Shop beautiful sarees or launch your own storefront on Sareeva.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
          <Input label="Full name" value={form.name} onChange={(event) => handleChange("name", event.target.value)} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => handleChange("email", event.target.value)} required />
          <Input label="Password" type="password" value={form.password} onChange={(event) => handleChange("password", event.target.value)} required />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(event) => handleChange("confirmPassword", event.target.value)} required />
          <Input label="Phone" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} />
          <div className="space-y-3">
            <p className="text-sm font-medium text-dark">I want to</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Buy", value: "BUYER" },
                { label: "Sell", value: "SELLER" },
              ].map((option) => (
                <label key={option.value} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${form.role === option.value ? "border-primary bg-primary text-white" : "border-zinc-200 text-zinc-600"}`}>
                  <input type="radio" name="role" value={option.value} checked={form.role === option.value} onChange={(event) => handleChange("role", event.target.value)} className="hidden" />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          {form.role === "SELLER" ? (
            <div className="md:col-span-2">
              <Input label="Store Name" value={form.storeName} onChange={(event) => handleChange("storeName", event.target.value)} required />
            </div>
          ) : null}
          {error ? <p className="md:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="accent" size="lg" type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</Button>
            <p className="text-sm text-zinc-500">Already have an account? <Link href="/auth/login" className="font-semibold text-primary">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
