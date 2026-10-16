/**
 * Sitenin canlı adresi. Netlify derleme sırasında `URL` değişkenini otomatik verir;
 * özel alan adı için NEXT_PUBLIC_SITE_URL ayarlanabilir.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000").replace(/\/$/, "");
