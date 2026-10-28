import type { Metadata } from "next";
import { PageHero, PostCard } from "@/components/ui";
import { publishedPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Góc nhìn thị trường",
  description: "Phân tích thị trường bất động sản cao cấp TP.HCM của anh Hải Đường, luôn kèm nguồn số liệu.",
  alternates: { canonical: "/goc-nhin" },
};

export default function BlogPage() {
  const posts = publishedPosts();
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHero
        label="Góc nhìn"
        title="Đọc thị trường bằng số liệu"
        lead="Báo cáo, hội thảo, tiến độ dự án: những gì đáng biết trước khi mua hoặc bán một căn cao cấp. Thông tin tham khảo, không phải khuyến nghị đầu tư."
      />
      <section className="bg-paper py-16 md:py-24">
        <div className="wrap">
          {!lead ? (
            <p className="bg-mist p-10 text-center text-muted">Bài viết đầu tiên sắp lên.</p>
          ) : (
            <>
              <div className="reveal">
                <PostCard p={lead} large />
              </div>
              {rest.length > 0 && (
                <div className="mt-20 grid gap-x-8 gap-y-14 border-t border-line pt-14 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <div key={p.id} className="reveal">
                      <PostCard p={p} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
