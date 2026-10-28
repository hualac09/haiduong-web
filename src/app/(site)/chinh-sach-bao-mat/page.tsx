import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  alternates: { canonical: "/chinh-sach-bao-mat" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero label="Pháp lý" title="Chính sách bảo mật" />
      <section className="bg-paper py-16 md:py-24">
        <div className="wrap prose-hd max-w-3xl">
          <p>Cập nhật ngày 28/10/2026. Áp dụng cho website này, do {site.company} vận hành.</p>
          <h2>Chúng tôi thu thập gì</h2>
          <ul>
            <li>Thông tin bạn điền vào form: họ tên, số điện thoại, email, lời nhắn, gói học bạn chọn.</li>
            <li>Nguồn truy cập (tham số utm, mã giới thiệu) nếu đường dẫn bạn bấm có kèm.</li>
            <li>Thông tin giao dịch chuyển khoản học phí do ngân hàng gửi về qua dịch vụ đối soát SePay: số tiền, nội dung, mã giao dịch.</li>
          </ul>
          <h2>Dùng để làm gì</h2>
          <ul>
            <li>Liên hệ tư vấn theo yêu cầu của bạn, xác nhận lịch hẹn.</li>
            <li>Xác nhận học phí và thêm bạn vào lớp học.</li>
            <li>Đo lường kênh nào mang lại khách để cải thiện nội dung.</li>
          </ul>
          <h2>Chia sẻ</h2>
          <p>
            Chúng tôi không bán hay chia sẻ thông tin của bạn cho bên thứ ba vì mục đích quảng cáo. Thông tin chỉ đi qua các dịch vụ
            cần thiết để vận hành: máy chủ lưu trữ, SePay (đối soát chuyển khoản), Telegram (thông báo nội bộ cho đội ngũ).
          </p>
          <h2>Lưu trữ và quyền của bạn</h2>
          <p>
            Dữ liệu được lưu trên máy chủ của chúng tôi trong thời gian cần thiết cho việc tư vấn và chăm sóc học viên. Bạn có thể
            yêu cầu xem, sửa hoặc xóa thông tin của mình bằng cách gọi hoặc nhắn Zalo {site.phoneDisplay}.
          </p>
          <h2>Cookie</h2>
          <p>Website chỉ dùng cookie cần thiết cho phần quản trị. Video YouTube được nhúng ở chế độ hạn chế cookie (youtube-nocookie.com).</p>
        </div>
      </section>
    </>
  );
}
