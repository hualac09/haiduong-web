import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { RevealObserver } from "@/components/Motion";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Hải Đường · Sunhomes Việt Nam",
  founder: { "@type": "Person", name: site.fullName, jobTitle: "Founder – CEO Sunhomes Việt Nam" },
  url: site.url,
  telephone: "+84906968377",
  address: {
    "@type": "PostalAddress",
    streetAddress: "27 Đường số 3, Hiệp Bình Phước",
    addressLocality: "Thủ Đức",
    addressRegion: "TP. Hồ Chí Minh",
    addressCountry: "VN",
  },
  areaServed: ["Thủ Thiêm", "Thảo Điền", "Ba Son", "Quận 1", "TP. Thủ Đức"],
  sameAs: site.socials.map((s) => s.href),
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="noi-dung">{children}</main>
      <Footer />
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
