"use client";

import { deleteListing, saveListing } from "@/app/admin/actions";
import type { Listing } from "@/lib/data";
import { KINDS, STATUSES } from "@/lib/site";
import { Field, FormMessage, Submit, useForm } from "../forms";
import { GalleryInput, ImageInput } from "./ImageInputs";

export default function ListingEditor({ l }: { l?: Listing }) {
  const [state, action] = useForm(saveListing);
  const v = (k: keyof Listing) => (l?.[k] == null ? "" : String(l[k]));
  return (
    <>
      <form action={action} className="grid gap-6 bg-paper p-5 md:p-8">
        {l && <input type="hidden" name="id" value={l.id} />}
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="title" label="Tên căn" state={state} required defaultValue={v("title")} />
          <Field name="slug" label="Đường dẫn (để trống: tự tạo)" state={state} defaultValue={v("slug")} />
          <Field name="project" label="Dự án" state={state} defaultValue={v("project")} />
          <Field name="district" label="Khu vực" state={state} defaultValue={v("district")} hint="Ví dụ: Thủ Thiêm, Thảo Điền, Quận 1" />
          <label className="field">
            <span>Loại hình</span>
            <select name="kind" className="input" defaultValue={v("kind") || "penthouse"}>
              {Object.entries(KINDS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Tình trạng</span>
            <select name="status" className="input" defaultValue={v("status") || "dang-ban"}>
              {Object.entries(STATUSES).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field name="price_label" label="Giá hiển thị" state={state} defaultValue={v("price_label")} hint="Ví dụ: 120 tỷ, 100 tr/tháng" />
          <Field name="price_billion" label="Giá (tỷ, để sắp xếp)" state={state} defaultValue={v("price_billion")} inputMode="text" />
          <Field name="area_m2" label="Diện tích m²" state={state} defaultValue={v("area_m2")} />
          <Field name="bedrooms" label="Phòng ngủ" state={state} defaultValue={v("bedrooms")} />
        </div>
        <Field name="summary" label="Tóm tắt (1–2 câu, hiện trên thẻ và Google)" state={state} rows={2} defaultValue={v("summary")} />
        <Field
          name="body"
          label="Mô tả chi tiết (Markdown: ## tiêu đề, **đậm**, - gạch đầu dòng)"
          state={state}
          rows={10}
          defaultValue={v("body")}
        />
        <Field name="youtube_id" label="Video YouTube (dán link)" state={state} defaultValue={v("youtube_id")} />
        <ImageInput name="cover" label="Ảnh bìa" defaultValue={v("cover")} />
        <GalleryInput name="gallery" defaultValue={l?.gallery ?? "[]"} />
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={l ? Boolean(l.published) : true} className="h-5 w-5" /> Công khai
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={Boolean(l?.featured)} className="h-5 w-5" /> Nổi bật trên trang chủ
          </label>
          <label className="flex items-center gap-2">
            Thứ tự <input type="number" name="sort" defaultValue={v("sort") || "0"} className="input !min-h-[40px] w-24" />
          </label>
        </div>
        <FormMessage state={state} />
        <div className="flex gap-3">
          <Submit className="btn btn-ink">Lưu</Submit>
          {l && (
            <a href={`/bat-dong-san/${l.slug}`} target="_blank" className="btn btn-ghost">
              Xem trên web
            </a>
          )}
        </div>
      </form>
      {l && (
        <form
          action={deleteListing}
          className="mt-6"
          onSubmit={(e) => {
            if (!confirm(`Xóa vĩnh viễn "${l.title}"?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={l.id} />
          <button className="cursor-pointer text-sm text-danger underline">Xóa căn này</button>
        </form>
      )}
    </>
  );
}
