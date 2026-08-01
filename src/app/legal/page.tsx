import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function LegalPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Page not{" "}
        <Link href="/control-center/login" className="cursor-text text-inherit no-underline">
          found
        </Link>
        .
      </h1>
      <p className="mt-4 text-foreground-muted">
        Whatever you were looking for isn&apos;t here — it may have moved, or the link might be
        wrong.
      </p>
      <Link href="/" className={`${buttonVariants()} mt-8`}>
        Back Home
      </Link>
    </section>
  );
}
