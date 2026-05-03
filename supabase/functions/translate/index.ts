const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { texts, target = "en" } = await req.json();
    if (!Array.isArray(texts) || texts.length === 0) {
      return new Response(JSON.stringify({ translations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const langName = target === "en" ? "English" : "French";
    const systemPrompt = `You are a professional translator. Translate each provided string into ${langName}. Preserve casing style (UPPERCASE stays uppercase), punctuation, emojis, and inline formatting. Do NOT translate proper nouns or brand names like "MUST AGENCE", "MUST", "TheArtist". Do NOT translate URLs, emails, or phone numbers. Return ONLY a JSON array of translated strings, same length and order as the input. No explanations.`;

    const userPrompt = JSON.stringify(texts);

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "credits_exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await aiRes.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    let parsed: any;
    try { parsed = JSON.parse(content); } catch { parsed = []; }
    let translations: string[] = [];
    if (Array.isArray(parsed)) translations = parsed;
    else if (Array.isArray(parsed.translations)) translations = parsed.translations;
    else if (Array.isArray(parsed.result)) translations = parsed.result;
    else {
      // Fallback: try first array value in object
      const firstArr = Object.values(parsed).find((v) => Array.isArray(v));
      if (firstArr) translations = firstArr as string[];
    }
    // Ensure same length
    while (translations.length < texts.length) translations.push(texts[translations.length]);

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
