import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "Tacitus Dave OS <onboarding@resend.dev>";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

export async function sendAccessKeyEmail(email: string, accessKey: string, orgName?: string): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Your Lab access key",
    html: `
      <div style="background:#0a0b0d;padding:40px 24px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
        <div style="max-width:480px;margin:0 auto;background:#121317;border:1px solid #22252b;border-radius:8px;padding:32px;">
          <p style="color:#2dd4bf;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">
            Tacitus Dave OS &middot; Lab Access${orgName ? ` &middot; ${orgName}` : ""}
          </p>
          <p style="color:#e8eaed;font-size:16px;margin:0 0 24px;">
            This is your personal access key — it signs you into the Lab for as long as your
            subscription is active. You'll be asked to enter it every time you open the site in a
            new browser session, so keep it somewhere safe rather than deleting this email.
          </p>
          <p style="color:#2dd4bf;font-size:22px;font-weight:600;letter-spacing:2px;margin:0 0 24px;word-break:break-all;">
            ${accessKey}
          </p>
          <p style="color:#9aa0a6;font-size:12px;margin:0 0 8px;">
            Treat this key like a password — anyone who has it can sign in as you. Don't share it,
            and don't forward this email.
          </p>
          <p style="color:#9aa0a6;font-size:12px;margin:0;">
            If you didn't subscribe to the Lab, you can ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
