import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PaytmChecksum } from "./PaytmChecksum.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { registrationId, redirectOrigin } = await req.json();

        if (!registrationId) {
            return new Response(JSON.stringify({ error: "Missing registration ID" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Initialize Supabase Client
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch registration details
        const { data: registration, error: regError } = await supabase
            .from("registrations")
            .select("*, students(*), events(*), batches(*)")
            .eq("id", registrationId)
            .single();

        if (regError || !registration) {
            return new Response(JSON.stringify({ error: "Registration not found" }), {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Determine amount
        const amount = registration.batches?.price || registration.events?.price || "1.00";
        // Sanitize amount to clean numeric string (remove ₹ or commas if present)
        const cleanAmount = String(amount).replace(/[^\d.]/g, "");
        const formattedAmount = Number(cleanAmount).toFixed(2);

        const paytmMid = Deno.env.get("PAYTM_MID") || "YOUR_MID_HERE";
        const paytmMerchantKey = Deno.env.get("PAYTM_MERCHANT_KEY") || "YOUR_KEY_HERE";
        const paytmWebsite = Deno.env.get("PAYTM_WEBSITE") || "WEBSTAGING";

        console.log("PAYTM CONFIG - MID:", paytmMid);
        console.log("PAYTM CONFIG - KEY LEN:", paytmMerchantKey.length);
        console.log("PAYTM CONFIG - KEY SECURED:", paytmMerchantKey.slice(0, 4) + "..." + paytmMerchantKey.slice(-4));
        console.log("PAYTM CONFIG - WEBSITE:", paytmWebsite);

        // Set Paytm Staging / Production host
        const isStaging = paytmWebsite === "WEBSTAGING";
        const paytmHost = isStaging ? "securegw-stage.paytm.in" : "securegw.paytm.in";

        const timestamp = Date.now();
        const orderId = `ORD-${registrationId.slice(0, 8)}-${timestamp}`;

        // Callback webhook point target
        const callbackUrl = `${supabaseUrl}/functions/v1/paytm-callback`;

        // Create payment tracking record in pending state
        const { error: payError } = await supabase.from("payments").insert({
            registration_id: registrationId,
            transaction_id: orderId,
            amount: parseFloat(formattedAmount),
            status: "pending",
            gateway_response: {
                redirect_origin: redirectOrigin || "http://localhost:5173",
            },
        });

        if (payError) {
            return new Response(JSON.stringify({ error: "Failed to initialize payment record: " + payError.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const paytmBody = {
            requestType: "Payment",
            mid: paytmMid,
            websiteName: paytmWebsite,
            orderId: orderId,
            callbackUrl: callbackUrl,
            txnAmount: {
                value: formattedAmount,
                currency: "INR",
            },
            userInfo: {
                custId: registration.students?.student_id || `CUST-${registration.students?.id?.slice(0, 8)}`,
                email: registration.students?.email || "student@ignite.com",
                mobile: registration.students?.phone || "9999999999",
            },
        };

        console.log("PAYTM BODY:", JSON.stringify(paytmBody, null, 2));

        // Generate Checksum Signature
        const signature = await PaytmChecksum.generateSignature(JSON.stringify(paytmBody), paytmMerchantKey);

        const requestPayload = {
            body: paytmBody,
            head: {
                signature: signature,
            },
        };

        // Call Paytm initiate API
        const paytmApiUrl = `https://${paytmHost}/theia/api/v1/initiateTransaction?mid=${paytmMid}&orderId=${orderId}`;
        const response = await fetch(paytmApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestPayload),
        });

        const responseData = await response.json();

        return new Response(JSON.stringify({
            orderId,
            mid: paytmMid,
            txnToken: responseData.body?.txnToken,
            isStaging,
            paytmResponse: responseData,
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
