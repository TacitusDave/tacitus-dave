import type { Metadata } from "next";
import { peekInvite } from "@/lib/invites";
import { AcceptInviteButton } from "@/components/account/accept-invite-button";

export const metadata: Metadata = {
  title: "Team Invite",
  robots: { index: false, follow: false },
};

export default async function InviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // Read-only peek — must NOT consume the invite. Email link-scanners (Microsoft
  // Defender Safe Links, etc.) GET this URL before a human ever clicks it; only
  // the explicit POST triggered by the button below actually consumes it.
  const invite = await peekInvite(token);

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Team Invite</p>

      {invite ? (
        <>
          <h1 className="mt-4 text-2xl font-medium tracking-tight text-foreground">
            Join {invite.orgName}
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            {invite.invitedBy} invited you as {invite.role === "admin" ? "an admin" : "a member"}.
            Accepting gives you full access to everything in the Lab.
          </p>
          <div className="mt-8">
            <AcceptInviteButton token={token} />
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-4 text-2xl font-medium tracking-tight text-foreground">
            This invite has expired or was already used.
          </h1>
          <p className="mt-3 text-sm text-foreground-muted">
            Ask whoever invited you to send a new one.
          </p>
        </>
      )}
    </section>
  );
}
