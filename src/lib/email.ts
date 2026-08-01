import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "Tacitus Dave OS <onboarding@resend.dev>";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

export async function sendAccessCodeEmail(email: string, code: string): Promise<void> {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `Your Lab access code: ${code}`,
    html: `
      <div style="background:#0a0b0d;padding:40px 24px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
        <div style="max-width:480px;margin:0 auto;background:#121317;border:1px solid #22252b;border-radius:8px;padding:32px;">
          <p style="color:#2dd4bf;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">
            Tacitus Dave OS &middot; Lab Access
          </p>
          <p style="color:#e8eaed;font-size:16px;margin:0 0 24px;">
            Use this code to sign in to the Lab. It expires in 15 minutes and can only be used once.
          </p>
          <p style="color:#2dd4bf;font-size:32px;font-weight:600;letter-spacing:4px;margin:0 0 24px;">
            ${code}
          </p>
          <p style="color:#9aa0a6;font-size:12px;margin:0;">
            If you didn't request this, you can ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
