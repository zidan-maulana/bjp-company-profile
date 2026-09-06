import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== "mock_resend_key" && resendApiKey !== "re_sample_api_key_here" ? new Resend(resendApiKey) : null;

export async function sendInquiryNotificationEmail(data: {
  name: string;
  companyName?: string | null;
  email: string;
  phone: string;
  serviceType?: string | null;
  message: string;
}) {
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || "barunajayaplastik.bjp@gmail.com";

  if (!resend) {
    console.log("[MOCK EMAIL SENDER] New Inquiry Received for Baruna Jaya Plastik:", {
      recipient,
      data,
    });
    return { success: true, mock: true };
  }

  try {
    await resend.emails.send({
      from: "Baruna Jaya Plastik Website <onboarding@resend.dev>",
      to: [recipient],
      subject: `[Lead Baru] Penawaran dari ${data.name} ${data.companyName ? `(${data.companyName})` : ""}`,
      html: `
        <h2>Permintaan Penawaran Baru (Inquiry)</h2>
        <p><strong>Nama:</strong> ${data.name}</p>
        <p><strong>Perusahaan:</strong> ${data.companyName || "-"}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telepon / WA:</strong> ${data.phone}</p>
        <p><strong>Layanan:</strong> ${data.serviceType || "-"}</p>
        <hr />
        <p><strong>Pesan / Kebutuhan:</strong></p>
        <p>${data.message.replace(/\n/g, "<br/>")}</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send inquiry email via Resend:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetOtpEmail(data: {
  email: string;
  otpCode: string;
}) {
  const recipient = data.email;

  if (!resend) {
    console.log(`[MOCK OTP SENDER] Verification OTP for ${recipient}: [${data.otpCode}]`);
    return { success: true, mock: true, otp: data.otpCode };
  }

  try {
    await resend.emails.send({
      from: "Baruna Jaya Plastik Security <onboarding@resend.dev>",
      to: [recipient],
      subject: `[Kode OTP: ${data.otpCode}] Verifikasi Kata Sandi - Baruna Jaya Plastik`,
      html: `
        <div style="background: #0D0D0D; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; padding: 32px; border: 1px solid #2B2B2B; max-width: 500px; margin: 0 auto;">
          <div style="border-bottom: 1px solid #2B2B2B; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #FFFFFF; margin: 0; font-size: 20px; letter-spacing: 2px;">BARUNA JAYA PLASTIK</h2>
            <p style="color: #888888; font-size: 11px; margin: 4px 0 0 0; letter-spacing: 1px;">SISTEM KEAMANAN OTORITAS ADMIN</p>
          </div>
          <p style="color: #CCCCCC; font-size: 13px; line-height: 1.6;">
            Kami menerima permintaan pembaruan kata sandi untuk akun administrator Baruna Jaya Plastik (<strong>${data.email}</strong>).
          </p>
          <div style="background: #1A1A1A; border: 1px dashed #EA580C; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #888888; font-size: 10px; margin: 0 0 8px 0; letter-spacing: 2px; text-transform: uppercase;">Kode Verifikasi (OTP)</p>
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #EA580C; font-family: monospace;">${data.otpCode}</span>
          </div>
          <p style="color: #888888; font-size: 11px; line-height: 1.5;">
            • Kode OTP ini berlaku selama <strong>10 menit</strong>.<br/>
            • Jika Anda tidak merasa melakukan permintaan ini, segera abaikan pesan ini. Keamanan akun Anda tetap terjaga.
          </p>
          <div style="border-top: 1px solid #2B2B2B; margin-top: 24px; padding-top: 16px; text-align: center;">
            <p style="color: #555555; font-size: 10px; margin: 0;">© ${new Date().getFullYear()} Baruna Jaya Plastik · Mold & Tooling Specialist</p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send OTP email via Resend:", error);
    return { success: false, error };
  }
}
