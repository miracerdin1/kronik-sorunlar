import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANAHTAR = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Supabase ayarlanmamışsa (ör. yerel geliştirme) katkı özellikleri gizlenir. */
export const katkiAcik = Boolean(URL && ANAHTAR);

let istemci: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  istemci ??= createClient(URL!, ANAHTAR!);
  return istemci;
}

/** Ziyaretçiyi anonim oturumla tanır; oturum tarayıcıda saklanır, sonraki ziyarette aynı kullanıcıdır. */
export async function oturumAc(): Promise<string> {
  const { data } = await supabase().auth.getSession();
  if (data.session) return data.session.user.id;
  const { data: yeni, error } = await supabase().auth.signInAnonymously();
  if (error || !yeni.user) throw error ?? new Error("Oturum açılamadı");
  return yeni.user.id;
}
