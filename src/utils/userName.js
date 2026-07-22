/**
 * Derives a display-ready first name from a Supabase auth user, regardless
 * of which sign-in path populated it: our own email-signup form writes
 * `first_name` directly; Apple's one-time FULL_NAME grant is captured into
 * the same key right after sign-in (see AuthScreen's handleAppleSignIn);
 * Google's OAuth response is stored by Supabase under `given_name`/`name`/
 * `full_name` depending on what Google returns. Falls back through all of
 * them so any signed-in user with a name on file gets one back.
 */
export function getFirstName(user) {
  if (!user) return null;
  const meta = user.user_metadata || {};
  const candidate = meta.first_name || meta.given_name || meta.full_name || meta.name || null;
  if (!candidate) return null;
  const first = String(candidate).trim().split(/\s+/)[0];
  return first || null;
}
