import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== "mock_resend_key" ? new Resend(resendApiKey) : null;

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
