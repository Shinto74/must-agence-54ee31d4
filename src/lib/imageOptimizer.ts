/**
 * Optimise une URL Supabase Storage en passant par le transformer image
 * (resize + compression). Renvoie l'URL d'origine si ce n'est pas une URL Supabase.
 *
 * @example
 *   optimizeImage(url, { width: 320, quality: 70 })
 */
export function optimizeImage(
  url: string | undefined | null,
  opts: { width?: number; height?: number; quality?: number; resize?: "cover" | "contain" | "fill" } = {}
): string {
  if (!url) return "";
  // Only Supabase storage public URLs benefit from /render/image transformations
  if (!url.includes("/storage/v1/object/public/")) return url;
  const { width, height, quality = 70, resize } = opts;
  const transformed = url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  const params = new URLSearchParams();
  if (width) params.set("width", String(width));
  if (height) params.set("height", String(height));
  params.set("quality", String(quality));
  // Par défaut "contain" : on garde l'image entière, le cadrage final est géré
  // côté CSS (object-cover / object-position) pour éviter un double-rognage
  // qui zoome trop sur le sujet (visages coupés).
  params.set("resize", resize ?? "contain");
  return `${transformed}?${params.toString()}`;
}

/**
 * Renvoie un srcset 1x/2x pour une image responsive.
 */
export function optimizeImageSrcSet(
  url: string | undefined | null,
  width: number,
  opts: { quality?: number } = {}
): string {
  if (!url) return "";
  const x1 = optimizeImage(url, { width, ...opts });
  const x2 = optimizeImage(url, { width: width * 2, ...opts });
  return `${x1} 1x, ${x2} 2x`;
}
