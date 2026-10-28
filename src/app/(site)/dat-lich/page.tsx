import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { Phone } from "@/components/icons";
import { openSlots } from "@/lib/data";
import { slotLabel } from "@/lib/format";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đặt lịch tư vấn",
  description: "Đặt lịch trao đổi 45 phút với anh Hải Đường về mua, bán, cho thuê bất động sản cao cấp hoặc khóa học môi giới.",
  alternates: { canonical: "/dat-lich" },
};

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ "muc-dich"?: string }> }) {
  const purpose = (await searchParams)["muc-dich"];
  const slots = openSlots().map((s) => ({ id: s.id, ...slotLabel(s.starts_at) }));

  return (
    <>
      <section className="bg-ink text-white">
        <div className="wrap pt-36 pb-14 md:pt-48 md:pb-20">
          <p className="label reveal text-gold">Đặt lịch</p>
          <h1 className="display reveal mt-6 max-w-[16ch] !text-[clamp(2.5rem,6vw,5.25rem)]">45 phút với anh Đường</h1>
          <div className="hairline reveal mt-10" />
          <p className="lead reveal mt-8 max-w-3xl text-white/80">
            Trao đổi riêng về căn bạn muốn mua, căn cần bán, hoặc con đường lên phân khúc cao cấp. Miễn phí, không ràng buộc.
          </p>
        </div>
      </section>
      <section className="bg-paper py-14 md:py-20">
        <div className="wrap grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <BookingForm slots={slots} purpose={purpose} />
          <aside className="grid content-start gap-4 lg:sticky lg:top-28">
            <div className="chamfer bg-mist p-8">
              <p className="label text-gold-deep">Cần gấp?</p>
              <a href={`tel:${site.phone}`} className="mt-4 flex items-center gap-3 text-2xl font-extralight hover:text-gold-deep">
                <Phone size={22} /> {site.phoneDisplay}
              </a>
              <a href={site.zalo} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6 text-ink">
                Nhắn Zalo
              </a>
            </div>
            <div className="bg-ink p-8 text-white/80">
              <p className="label text-gold">Văn phòng</p>
              <p className="mt-4">{site.address}</p>
              <p className="mt-4 text-sm text-white/60">Thông tin bạn gửi chỉ dùng để liên hệ, không chia sẻ cho bên thứ ba.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
