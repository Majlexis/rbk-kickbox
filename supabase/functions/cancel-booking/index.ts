import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get("booking_id");
    const slotId = url.searchParams.get("slot_id");

    if (!bookingId || !slotId) {
      return new Response("<h2>Neplatny odkaz</h2>", {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { data: booking } = await supabase
      .from("bookings")
      .select("*, time_slots(*)")
      .eq("id", bookingId)
      .single();

    await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
    await supabase.from("time_slots").update({ status: "available", current_bookings: 0 }).eq("id", slotId);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const GYM_EMAIL = Deno.env.get("SMTP_EMAIL");

    const cancelEmailHtml =
      "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0d0d0d;padding:30px 20px;font-family:Arial,sans-serif;'>" +
      "<tr><td align='center'>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px;background:#1a1a1a;border-radius:4px;overflow:hidden;'>" +
      "<tr><td style='background:#cc0000;padding:32px 30px;text-align:center;'>" +
      "<div style='font-size:28px;font-weight:900;color:#ffffff;letter-spacing:6px;'>RBK KICKBOX</div>" +
      "<div style='font-size:11px;color:#ffaaaa;letter-spacing:3px;margin-top:8px;text-transform:uppercase;'>Fitness &amp; Kickbox</div>" +
      "</td></tr>" +
      "<tr><td style='padding:40px 36px 32px;'>" +
      "<h2 style='color:#cc0000;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:1px;'>&#10060; Rezervácia bola zrušená</h2>" +
      "<p style='color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 32px;'>Zákazník zrušil svoju rezerváciu. Termín bol uvoľnený a je opäť dostupný.</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='margin:0 0 24px;'>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128100; Zákazník</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + (booking?.customer_name || "neznámy") + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#9993; Email</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + (booking?.customer_email || "neznámy") + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128222; Telefón</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + (booking?.customer_phone || "–") + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128197; Dátum</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + (booking?.time_slots?.date || "neznámy") + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #cc0000;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128336; Čas</div>" +
      "<div style='color:#ffffff;font-size:16px;font-weight:bold;'>" + (booking?.time_slots?.start_time?.slice(0,5) || "") + " &ndash; " + (booking?.time_slots?.end_time?.slice(0,5) || "") + "</div>" +
      "</td></tr>" +
      "</table>" +
      "<div style='background:#0d1f0d;border:1px solid #1a3a1a;border-left:4px solid #22cc44;padding:16px 18px;border-radius:2px;'>" +
      "<p style='color:#44dd66;font-size:14px;font-weight:bold;margin:0;'>&#10003;&nbsp; Termín je opäť voľný a dostupný pre nové rezervácie.</p>" +
      "</div>" +
      "</td></tr>" +
      "<tr><td style='background:#111111;padding:24px 36px;text-align:center;border-top:1px solid #2a2a2a;'>" +
      "<p style='color:#555555;font-size:12px;margin:0 0 4px;font-weight:bold;letter-spacing:2px;'>RBK KICKBOX</p>" +
      "<p style='color:#444444;font-size:11px;margin:0;'>Administrátorské upozornenie &mdash; automaticky generovaný email.</p>" +
      "</td></tr>" +
      "</table></td></tr></table>";

    const customerCancelHtml =
      "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0d0d0d;padding:30px 20px;font-family:Arial,sans-serif;'>" +
      "<tr><td align='center'>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px;background:#1a1a1a;border-radius:4px;overflow:hidden;'>" +
      "<tr><td style='background:#cc0000;padding:32px 30px;text-align:center;'>" +
      "<div style='font-size:28px;font-weight:900;color:#ffffff;letter-spacing:6px;'>RBK KICKBOX</div>" +
      "<div style='font-size:11px;color:#ffaaaa;letter-spacing:3px;margin-top:8px;text-transform:uppercase;'>Fitness &amp; Kickbox</div>" +
      "</td></tr>" +
      "<tr><td style='padding:40px 36px 32px;'>" +
      "<h2 style='color:#cc0000;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:1px;'>&#10003; Rezervácia zrušená</h2>" +
      "<p style='color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 32px;'>Ahoj <strong style='color:#ffffff;'>" + (booking?.customer_name || "") + "</strong>, tvoja rezervácia bola úspešne zrušená.</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='margin:0 0 28px;'>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #555555;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128197; Dátum</div>" +
      "<div style='color:#aaaaaa;font-size:16px;font-weight:bold;text-decoration:line-through;'>" + (booking?.time_slots?.date || "") + "</div>" +
      "</td></tr>" +
      "<tr><td style='height:3px;'></td></tr>" +
      "<tr><td style='padding:14px 18px;background:#111111;border-left:4px solid #555555;'>" +
      "<div style='color:#888888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;'>&#128336; Čas</div>" +
      "<div style='color:#aaaaaa;font-size:16px;font-weight:bold;text-decoration:line-through;'>" + (booking?.time_slots?.start_time?.slice(0,5) || "") + " &ndash; " + (booking?.time_slots?.end_time?.slice(0,5) || "") + "</div>" +
      "</td></tr>" +
      "</table>" +
      "<p style='color:#999999;font-size:14px;line-height:1.6;margin:0;'>Ak si si to rozmyslel, môžeš si rezervovať nový termín na našej stránke. Tešíme sa na teba!</p>" +
      "</td></tr>" +
      "<tr><td style='background:#111111;padding:24px 36px;text-align:center;border-top:1px solid #2a2a2a;'>" +
      "<p style='color:#555555;font-size:12px;margin:0 0 4px;font-weight:bold;letter-spacing:2px;'>RBK KICKBOX</p>" +
      "<p style='color:#444444;font-size:11px;margin:0;'>Tento email bol vygenerovaný automaticky &mdash; neodpovedaj naň.</p>" +
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
        subject: "Zrušenie rezervácie – RBK KICKBOX",
        html: cancelEmailHtml,
      }),
    });

    if (booking?.customer_email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: "RBK Kickbox <info@rbkkickbox.sk>",
          to: booking.customer_email,
          subject: "Potvrdenie zrušenia rezervácie – RBK KICKBOX",
          html: customerCancelHtml,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response("<h2>Chyba: " + error.message + "</h2>", {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
});
