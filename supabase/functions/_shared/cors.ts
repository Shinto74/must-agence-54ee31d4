// Shared CORS headers for all edge functions.
// Defined locally because `npm:@supabase/supabase-js@2/cors` does NOT exist
// (the import was silently undefined in some runtimes, causing OPTIONS
// preflights to fail with no body and breaking checkout in production).
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-retry-count",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};
