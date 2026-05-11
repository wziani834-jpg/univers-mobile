const OWNER_EMAIL = "univers.mobile@hotmail.fr";
const FROM_EMAIL = "Dit <dit@univers-mobile.store>";
const SITE_NAME = "Univers Mobile";
const SITE_URL = "https://univers-mobile.store";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toText(value) {
  return String(value ?? "").trim();
}

function buildOwnerHtml(data) {
  const rows = [
    ["Nom", data.name],
    ["Email", data.email],
    ["Téléphone", data.phone],
    ["Appareil", data.device],
    ["Service souhaité", data.service],
    ["Message", data.message],
  ];

  const body = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:700;background:#f9fafb;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6">
      <h2 style="margin:0 0 12px;font-size:20px;">Nouvelle demande de contact - ${escapeHtml(SITE_NAME)}</h2>
      <p style="margin:0 0 16px;">Une nouvelle demande a ete envoyee depuis le formulaire du site.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">
        <tbody>${body}</tbody>
      </table>
      <p style="margin:16px 0 0;">
        Site: <a href="${SITE_URL}" style="color:#0f7cff;">${SITE_URL}</a>
      </p>
    </div>
  `;
}

function buildConfirmationHtml(data) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6">
      <h2 style="margin:0 0 12px;font-size:20px;">Demande bien recu - ${escapeHtml(SITE_NAME)}</h2>
      <p style="margin:0 0 12px;">Bonjour ${escapeHtml(data.name || "et merci")},</p>
      <p style="margin:0 0 12px;">
        Nous avons bien recu votre demande de contact. Nous vous repondrons des que possible.
      </p>
      <p style="margin:0 0 12px;">
        Recapitulatif: ${escapeHtml(data.service || "demande de renseignements")} pour ${escapeHtml(data.device || "votre appareil")}.
      </p>
      <p style="margin:0 0 12px;">
        Si besoin, vous pouvez aussi nous joindre au <strong>06 89 07 59 65</strong> ou venir au
        <strong>47 Rue Montesquieu, 47000 Agen</strong>.
      </p>
      <p style="margin:0;">
        <a href="${SITE_URL}" style="color:#0f7cff;">Visiter le site</a>
      </p>
    </div>
  `;
}

async function sendResendEmail(apiKey, payload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.error || `Resend error (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export async function onRequestPost({ request, env }) {
  try {
    const apiKey = env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "RESEND_API_KEY manquante" }, { status: 500 });
    }

    const formData = await request.formData();
    const data = {
      name: toText(formData.get("name")),
      email: toText(formData.get("email")),
      phone: toText(formData.get("phone")),
      device: toText(formData.get("device")),
      service: toText(formData.get("service")),
      message: toText(formData.get("message")),
    };

    if (!data.name || !data.email || !data.message) {
      return Response.json(
        { error: "Les champs nom, email et message sont obligatoires." },
        { status: 400 },
      );
    }

    const ownerEmailPromise = sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `Nouvelle demande de contact - ${data.name}`,
      html: buildOwnerHtml(data),
      reply_to: data.email,
    });

    const confirmationEmailPromise = sendResendEmail(apiKey, {
      from: FROM_EMAIL,
      to: data.email,
      subject: `Confirmation de votre demande - ${SITE_NAME}`,
      html: buildConfirmationHtml(data),
      reply_to: OWNER_EMAIL,
    });

    const [ownerEmail, confirmationEmail] = await Promise.all([
      ownerEmailPromise,
      confirmationEmailPromise,
    ]);

    return Response.json({
      ok: true,
      ownerEmailId: ownerEmail.id,
      confirmationEmailId: confirmationEmail.id,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Erreur inconnue lors de l'envoi",
      },
      { status: 500 },
    );
  }
}
