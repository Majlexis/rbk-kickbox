import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const { name, email, message } = JSON.parse(body);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const GYM_EMAIL = Deno.env.get("SMTP_EMAIL");

    const contactEmailHtml =
      "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0d0d0d;padding:30px 20px;font-family:Arial,sans-serif;'>" +
      "<tr><td align='center'>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px;background:#1a1a1a;border-radius:4px;overflow:hidden;'>" +
      "<tr><td style='background:#cc0000;padding:32px 30px;text-align:center;'>" +
      "<div style='font-size:28px;font-weight:900;color:#ffffff;letter-spacing:6px;'>RBK KICKBOX</div>" +
      "<div style='font-size:11px;color:#ffaaaa;letter-spacing:3px;margin-top:8px;text-transform:uppercase;'>Fitness &amp; Kickbox</div>" +
      "</td></tr>" +
      "<tr><td style='padding:40px 36px 32px;'>" +
      "<h2 style='color:#cc0000;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:1px;'>&#128172; Nová správa z webu</h2>" +
      "<p style='color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 32px;'>Prišla nová správa z kontaktného formulára na webe.</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='margin:0 0 24px;'>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128100; Meno</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + name + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#9993; Email</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + email + "</div>" +
      "</td></tr>" +
      "</table>" +
      "<div style='background:#111111;border-left:4px solid #cc0000;padding:20px 18px;margin:0 0 24px;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;'>&#128172; Správa</div>" +
      "<p style='color:#dddddd;font-size:15px;line-height:1.7;margin:0;'>" + message + "</p>" +
      "</div>" +
      "<div style='background:#0d0d18;border:1px solid #2a2a3a;border-left:4px solid #5566cc;padding:16px 18px;border-radius:2px;'>" +
      "<p style='color:#8899dd;font-size:13px;margin:0;'>&#8617;&nbsp; Odpovedz priamo na tento email &mdash; odpoveď pôjde zákazníkovi na <strong style='color:#aabbff;'>" + email + "</strong></p>" +
      "</div>" +
      "</td></tr>" +
      "<tr><td style='background:#111111;padding:24px 36px;text-align:center;border-top:1px solid #2a2a2a;'>" +
      "<p style='color:#555555;font-size:12px;margin:0 0 4px;font-weight:bold;letter-spacing:2px;'>RBK KICKBOX</p>" +
      "<p style='color:#444444;font-size:11px;margin:0;'>Správa z kontaktného formulára &mdash; automaticky generovaný email.</p>" +
      "</td></tr>" +
      "</table></td></tr></table>";

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "RBK Kickbox <info@rbkkickbox.sk>",
        to: GYM_EMAIL,
        reply_to: email,
        subject: "Nová správa z webu od " + name + " – RBK KICKBOX",
        html: contactEmailHtml,
      }),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
