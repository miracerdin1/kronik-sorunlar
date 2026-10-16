/** Sitenin canlı adresi. Vercel'de proje alan adı otomatik gelir; özel alan adı için NEXT_PUBLIC_SITE_URL ayarlanır. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
