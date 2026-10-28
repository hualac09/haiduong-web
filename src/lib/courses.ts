// Nội dung hai khóa, lấy từ landing pre-order đã duyệt (hai-duong-academy/index.html).
export const courses = [
  {
    id: "k1",
    tag: "Khóa 1 · Thương hiệu cá nhân",
    name: "Personal Brand Pro",
    promise: "Khách tự tìm đến",
    forWho: "Môi giới 0–5 năm, chưa có kênh hoặc kênh chưa ra khách.",
    outcome: "Kênh chuẩn trên 2 nền tảng, 30 video đã đăng, một phễu thu khách qua Zalo đang chạy.",
    perks: ["6 tuần video + 6 buổi live", "Chấm kênh trực tiếp", "30 kịch bản video mẫu"],
    weeks: [
      "Định vị: chọn phân khúc, chân dung khách, câu chuyện cá nhân",
      "Hồ sơ và hình ảnh trên 4 kênh",
      "Hệ nội dung, 30 ý tưởng, hook 3 giây, kịch bản 60 giây",
      "Quay bằng điện thoại, CapCut, AI viết kịch bản",
      "Thuật toán TikTok, YouTube, Facebook, livestream",
      "Từ người xem thành khách: Zalo OA, chăm sóc, đo lường",
    ],
  },
  {
    id: "k2",
    tag: "Khóa 2 · Bán hàng cao cấp & sự nghiệp",
    name: "Luxury Closer",
    promise: "Chốt deal 20–200 tỷ",
    forWho: "Môi giới từ 1 năm muốn lên phân khúc cao cấp, và trưởng nhóm.",
    outcome: "Hồ sơ 20 khách VIP tiềm năng, bộ kịch bản tư vấn cao cấp, kế hoạch sự nghiệp 3 năm.",
    perks: ["6 tuần video + 6 buổi live", "Kịch bản Việt – Anh cho khách nước ngoài", "Ưu tiên ứng tuyển Sunhomes"],
    weeks: [
      "Thế giới khách giàu: HNWI, khách nước ngoài, nhà đầu tư",
      "Nguồn khách cao cấp: giới thiệu, private banking, xe sang, golf",
      "Đọc dự án, định giá penthouse, pháp lý người nước ngoài",
      "Dẫn xem nhà, quay tour, trình bày giá 50–200 tỷ",
      "Đàm phán, xử lý từ chối, đặt cọc, hậu mãi",
      "Lộ trình: môi giới → chuyên gia → trưởng nhóm → founder",
    ],
  },
] as const;

export const comboPerks = ["Toàn bộ 2 khóa, 12 buổi live", "Rẻ hơn mua lẻ", "Buổi hỏi đáp riêng nhóm Founding member"];

export const faqs = [
  {
    q: "Tôi bận đi dẫn khách, có theo kịp không?",
    a: "Mỗi tuần khoảng 3 giờ: 1 giờ video, 1,5 giờ live buổi tối và bài tập làm ngay trong công việc. Mọi buổi live đều có bản ghi, xem lại trong 12 tháng.",
  },
  {
    q: "Tôi chưa từng bán căn cao cấp, có nên học Khóa 2?",
    a: "Có. Khóa 2 thiết kế cho người muốn chuyển lên phân khúc cao cấp. Nếu bạn chưa có kênh cá nhân, nên chọn Combo để có cả nguồn khách lẫn kỹ năng chốt.",
  },
  {
    q: "Học ở đâu, bằng gì?",
    a: "Video học trên nền tảng khóa học online, live qua Zoom lúc 20h mỗi tuần, trao đổi trong nhóm Zalo riêng của khóa.",
  },
  {
    q: "Khóa học có cấp chứng chỉ hành nghề môi giới không?",
    a: "Không. Đây là khóa kỹ năng; học viên hoàn thành từ 80% bài tập nhận giấy chứng nhận hoàn thành của Hải Đường Academy.",
  },
  {
    q: "Thanh toán thế nào, bao lâu thì được vào lớp?",
    a: "Chuyển khoản qua mã VietQR trên trang thanh toán. Hệ thống tự xác nhận khi tiền vào; đội ngũ thêm bạn vào nhóm Zalo của khóa trong 2 giờ làm việc.",
  },
  {
    q: "Nếu học thử thấy không hợp thì sao?",
    a: "Học tuần đầu, làm bài tập tuần 1. Nếu thấy không phù hợp, nhắn cho đội ngũ trong 7 ngày kể từ khai giảng để được hoàn toàn bộ học phí. Khóa học không cam kết thu nhập; kết quả phụ thuộc vào việc bạn áp dụng.",
  },
  {
    q: "Đăng ký theo nhóm có ưu đãi không?",
    a: "Từ 5 học viên cùng sàn hoặc cùng đội được giảm thêm 10% so với giá đợt hiện tại. Trưởng nhóm đặt lịch trao đổi và ghi số người, đội ngũ sẽ gọi lại.",
  },
];
