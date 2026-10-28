import { deleteWave, saveWave } from "@/app/admin/actions";
import { AdminTitle, Card, smallBtn } from "@/components/admin/ui";
import { pricingState } from "@/lib/pricing";
import type { Wave } from "@/lib/data";

function WaveRow({ w, current }: { w?: Wave; current?: boolean }) {
  return (
    <form action={saveWave} className={`grid items-end gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_80px_auto] ${current ? "bg-gold-soft" : "bg-paper"}`}>
      {w && <input type="hidden" name="id" value={w.id} />}
      <label className="field">
        <span>Tên đợt {current && <span className="text-gold-deep">· đang áp dụng</span>}</span>
        <input name="name" defaultValue={w?.name ?? ""} className="input" required placeholder="Đợt mới" />
      </label>
      <label className="field">
        <span>Bắt đầu</span>
        <input type="date" name="starts_on" defaultValue={w?.starts_on ?? ""} className="input" required />
      </label>
      <label className="field">
        <span>Kết thúc</span>
        <input type="date" name="ends_on" defaultValue={w?.ends_on ?? ""} className="input" />
      </label>
      <label className="field">
        <span>Khóa 1 (đ)</span>
        <input name="price_k1" inputMode="numeric" defaultValue={w?.price_k1 ?? ""} className="input" required />
      </label>
      <label className="field">
        <span>Khóa 2 (đ)</span>
        <input name="price_k2" inputMode="numeric" defaultValue={w?.price_k2 ?? ""} className="input" required />
      </label>
      <label className="field">
        <span>Combo (đ)</span>
        <input name="price_combo" inputMode="numeric" defaultValue={w?.price_combo ?? ""} className="input" required />
      </label>
      <label className="field">
        <span>Suất</span>
        <input name="slots" inputMode="numeric" defaultValue={w?.slots ?? ""} className="input" />
      </label>
      <div className="flex gap-2 pb-1">
        <button className={smallBtn}>{w ? "Lưu" : "Thêm đợt"}</button>
        {w && (
          <button formAction={deleteWave} className={`${smallBtn} text-danger`}>
            Xóa
          </button>
        )}
      </div>
    </form>
  );
}

export default function WavesPage() {
  const { current, all } = pricingState();
  return (
    <>
      <AdminTitle title="Học phí theo đợt">
        Trang Học viện tự chọn đợt theo ngày hôm nay (giờ Việt Nam). Để trống “Kết thúc” cho giá chính thức. Không có đợt nào đang chạy thì
        nút đăng ký chuyển sang danh sách chờ.
      </AdminTitle>
      <div className="grid gap-2">
        {all.map((w) => (
          <WaveRow key={w.id} w={w} current={current?.id === w.id} />
        ))}
      </div>
      <Card className="mt-8">
        <h2 className="mb-4 text-lg font-light">Thêm đợt</h2>
        <WaveRow />
      </Card>
    </>
  );
}
