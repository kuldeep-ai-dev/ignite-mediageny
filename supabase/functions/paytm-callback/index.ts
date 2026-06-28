import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PaytmChecksum } from "./PaytmChecksum.ts";

serve(async (req) => {
    // Paytm status callback is a POST request with form-urlencoded body
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const formData = await req.formData();
        const paytmParams: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
            paytmParams[key] = String(value);
        }

        const orderId = paytmParams.ORDERID;
        const checksum = paytmParams.CHECKSUMHASH;

        if (!orderId || !checksum) {
            return new Response("Invalid payment callback metadata", { status: 400 });
        }

        // Initialize Supabase Client
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch the pending payment record and registration details
        const { data: payment, error: payFetchError } = await supabase
            .from("payments")
            .select("*, registrations(*)")
            .eq("transaction_id", orderId)
            .single();

        if (payFetchError || !payment) {
            return new Response("Associated payment record not found", { status: 404 });
        }

        const redirectOrigin = payment.gateway_response?.redirect_origin || "http://localhost:5173";
        const registrationId = payment.registration_id;

        // Verify Paytm Checksum
        const paytmMerchantKey = Deno.env.get("PAYTM_MERCHANT_KEY") || "YOUR_KEY_HERE";

        // We must copy params and delete CHECKSUMHASH for verification
        const verifyParams = { ...paytmParams };
        delete verifyParams.CHECKSUMHASH;

        const isSignatureValid = PaytmChecksum.verifySignature(verifyParams, paytmMerchantKey, checksum);

        const isSuccess = isSignatureValid && paytmParams.STATUS === "TXN_SUCCESS";
        const newStatus = isSuccess ? "paid" : "failed";

        // Update payment record
        await supabase
            .from("payments")
            .update({
                status: newStatus,
                gateway_response: {
                    ...payment.gateway_response,
                    paytm_callback_raw: paytmParams,
                    checksum_valid: isSignatureValid,
                },
            })
            .eq("id", payment.id);

        // Update registration table
        if (isSuccess) {
            await supabase
                .from("registrations")
                .update({
                    payment_status: "paid",
                    status: "confirmed",
                })
                .eq("id", registrationId);
        } else {
            await supabase
                .from("registrations")
                .update({
                    payment_status: "failed",
                })
                .eq("id", registrationId);
        }

        // Redirect user to the corresponding payment status view in frontend
        const redirectUrl = `${redirectOrigin}/payment-status?status=${newStatus}&regId=${registrationId}&orderId=${orderId}&msg=${encodeURIComponent(paytmParams.RESPMSG || "")}`;

        return new Response(null, {
            status: 302,
            headers: {
                Location: redirectUrl,
            },
        });
    } catch (err: any) {
        return new Response("Callback processing failed: " + err.message, { status: 500 });
    }
});
