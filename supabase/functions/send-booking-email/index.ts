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
    console.log("Received body:", body);

    if (!body) {
      return new Response(JSON.stringify({ error: "Empty body" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const { customer_name, customer_email, customer_phone, trainer_name, date, start_time, end_time, booking_id, slot_id } = JSON.parse(body);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const GYM_EMAIL = Deno.env.get("SMTP_EMAIL");

    const cancelUrl = "https://rbkhumenne.sk/zrusenie?booking_id=" + booking_id + "&slot_id=" + slot_id;

    const customerHtml =
      "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0d0d0d;padding:30px 20px;font-family:Arial,sans-serif;'>" +
      "<tr><td align='center'>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px;background:#1a1a1a;border-radius:4px;overflow:hidden;'>" +
      "<tr><td style='background:#cc0000;padding:32px 30px;text-align:center;'>" +
      "<div style='font-size:28px;font-weight:900;color:#ffffff;letter-spacing:6px;'>RBK KICKBOX</div>" +
      "<div style='font-size:11px;color:#ffaaaa;letter-spacing:3px;margin-top:8px;text-transform:uppercase;'>Fitness &amp; Kickbox</div>" +
      "</td></tr>" +
      "<tr><td style='padding:40px 36px 32px;'>" +
      "<h2 style='color:#cc0000;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:1px;'>&#10003; Rezervácia potvrdená!</h2>" +
      "<p style='color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 32px;'>Ahoj <strong style='color:#ffffff;'>" + customer_name + "</strong>, tvoja rezervácia bola úspešne potvrdená. Tešíme sa na teba!</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='margin:0 0 32px;'>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#127947; Tréner</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + trainer_name + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128197; Dátum</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + date + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128336; Čas</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + start_time + " &ndash; " + end_time + "</div>" +
      "</td></tr>" +
      "</table>" +
      "<p style='color:#999999;font-size:13px;line-height:1.6;margin:0 0 28px;'>Ak sa nemôžeš zúčastniť, zruš prosím rezerváciu vopred, aby sme mohli termín uvoľniť pre ostatných.</p>" +
      "<a href='" + cancelUrl + "' style='display:inline-block;background:#cc0000;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;border-radius:2px;'>&#10005;&nbsp; Zrušiť rezerváciu</a>" +
      "</td></tr>" +
      "<tr><td style='background:#111111;padding:24px 36px;text-align:center;border-top:1px solid #2a2a2a;'>" +
      "<p style='color:#555555;font-size:12px;margin:0 0 4px;font-weight:bold;letter-spacing:2px;'>RBK KICKBOX</p>" +
      "<p style='color:#444444;font-size:11px;margin:0;'>Tento email bol vygenerovaný automaticky &mdash; neodpovedaj naň.</p>" +
      "</td></tr>" +
      "</table></td></tr></table>";

    const gymHtml =
      "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0d0d0d;padding:30px 20px;font-family:Arial,sans-serif;'>" +
      "<tr><td align='center'>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px;background:#1a1a1a;border-radius:4px;overflow:hidden;'>" +
      "<tr><td style='background:#cc0000;padding:32px 30px;text-align:center;'>" +
      "<div style='font-size:28px;font-weight:900;color:#ffffff;letter-spacing:6px;'>RBK KICKBOX</div>" +
      "<div style='font-size:11px;color:#ffaaaa;letter-spacing:3px;margin-top:8px;text-transform:uppercase;'>Fitness &amp; Kickbox</div>" +
      "</td></tr>" +
      "<tr><td style='padding:40px 36px 32px;'>" +
      "<h2 style='color:#cc0000;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:1px;'>&#128197; Nová rezervácia!</h2>" +
      "<p style='color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 32px;'>Prišla nová rezervácia od zákazníka.</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='margin:0 0 20px;'>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128100; Zákazník</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + customer_name + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#9993; Email</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + customer_email + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#127947; Tréner</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + trainer_name + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128222; Telefón</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + (customer_phone || "–") + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128197; Dátum</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + date + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128336; Čas</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + start_time + " &ndash; " + end_time + "</div>" +
      "</td></tr>" +
      "</table>" +
      "</td></tr>" +
      "<tr><td style='background:#111111;padding:24px 36px;text-align:center;border-top:1px solid #2a2a2a;'>" +
      "<p style='color:#555555;font-size:12px;margin:0 0 4px;font-weight:bold;letter-spacing:2px;'>RBK KICKBOX</p>" +
      "<p style='color:#444444;font-size:11px;margin:0;'>Administrátorské upozornenie &mdash; automaticky generovaný email.</p>" +
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
        to: customer_email,
        subject: "Potvrdenie rezervácie – RBK KICKBOX",
        html: customerHtml,
      }),
    });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "RBK Kickbox <info@rbkkickbox.sk>",
        to: GYM_EMAIL,
        subject: "Nová rezervácia – RBK KICKBOX",
        html: gymHtml,
      }),
    });

    console.log("Emails sent!");

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
