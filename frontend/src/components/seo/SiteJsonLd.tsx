// Server component — emits Schema.org JSON-LD for the whole site.
// Tells Google: "this is a real estate website with search functionality"
// Result: rich snippets + sitelinks search box in SERP.

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://binhorizon.com";

export default function SiteJsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "BinHorizon",
      alternateName: ["BinHorizon Real Estate", "Bất động sản BinHorizon"],
      url: BASE_URL,
      logo: `${BASE_URL}/icon.png`,
      sameAs: [
        // Add your social profiles here when ready
        // "https://www.facebook.com/binhorizon",
        // "https://zalo.me/84933272169",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+84-1800-6834",
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["Vietnamese", "English", "Chinese"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "BinHorizon",
      url: BASE_URL,
      inLanguage: ["vi", "en", "zh"],
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/bat-dong-san?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "BinHorizon",
      url: BASE_URL,
      areaServed: { "@type": "Country", name: "Vietnam" },
      knowsLanguage: ["vi", "en", "zh"],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
