export type Yakit = "benzin" | "dizel" | "lpg" | "hibrit" | "elektrik";
export type Ciddiyet = "yuksek" | "orta" | "dusuk";
export type Guven = "dogrulandi" | "tek-kaynak";

export interface Motor {
  id: string;
  ad: string;
  yakit: Yakit;
}

export interface Sorun {
  id: string;
  baslik: string;
  parca: string;
  belirtiler: string;
  km: string | null;
  ciddiyet: Ciddiyet;
  maliyetTl: string | null;
  /** Sorunun görüldüğü motor id'leri; "hepsi" ise nesildeki tüm motorlar. */
  motorlar: string[] | "hepsi";
  /** Yalnızca belirli bir şanzıman tipinde görülüyorsa (ör. "DSG otomatik"). */
  sanziman?: string;
  not?: string;
  /** Kaynaklardan otomatik hesaplanır, JSON'a yazılmaz. */
  guven: Guven;
  kaynaklar: string[];
}

export interface Nesil {
  slug: string;
  ad: string;
  /** [başlangıç, bitiş] model yılı, iki uç dahil. */
  yillar: [number, number];
  /** Kasa geneli için kısa değerlendirme (ör. "bilinen ciddi kronik arıza yok"). */
  not?: string;
  motorlar: Motor[];
  sorunlar: Sorun[];
}

export interface Model {
  marka: string;
  markaSlug: string;
  model: string;
  modelSlug: string;
  nesiller: Nesil[];
}

/** Seçim formuna gönderilen hafif katalog. */
export interface KatalogModel {
  ad: string;
  slug: string;
  nesiller: { slug: string; ad: string; yillar: [number, number]; yakitlar: Yakit[] }[];
}

export interface KatalogMarka {
  ad: string;
  slug: string;
  modeller: KatalogModel[];
}

export const yakitAdi: Record<Yakit, string> = {
  benzin: "Benzin",
  dizel: "Dizel",
  lpg: "Benzin + LPG",
  hibrit: "Hibrit",
  elektrik: "Elektrik",
};

export const ciddiyetAdi: Record<Ciddiyet, string> = {
  yuksek: "Yüksek",
  orta: "Orta",
  dusuk: "Düşük",
};
