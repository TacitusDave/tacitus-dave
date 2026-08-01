import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-sm px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Control Center</p>
      <h1 className="mt-4 text-2xl font-medium tracking-tight text-foreground">Sign in.</h1>
      <div className="mt-8">
        <AdminLoginForm />
      </div>
    </section>
  );
}
