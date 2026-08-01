import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Page not found.
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
