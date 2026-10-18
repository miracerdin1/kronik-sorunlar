export default function JsonLd({ veri }: { veri: object }) {
  // `<` kaçırılır ki veri içindeki metin script etiketini kapatamasın.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(veri).replace(/</g, "\\u003c") }} />;
}
