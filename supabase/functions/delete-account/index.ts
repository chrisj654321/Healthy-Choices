// delete-account
// Permanently deletes the calling user's Supabase auth account.
// Required for Apple App Review guideline 5.1.1(v) — in-app account deletion.
//
// Deploy:  supabase functions deploy delete-account
// The function authenticates the caller from their JWT, then deletes the
// user with the service-role key (available to Edge Functions by default
// as SUPABASE_SERVICE_ROLE_KEY — never ship that key in the app).

import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  // Resolve the caller from their own JWT — the function only ever deletes
  // the account that invoked it.
  const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const adminClient = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
  if (deleteError) {
    // Log the full error server-side (visible in Edge Function logs only);
    // never return the raw provider message to the client.
    console.error("delete-account failed for user", user.id, deleteError);
    return json({ error: "Could not delete account. Please try again." }, 500);
  }

  return json({ success: true });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
