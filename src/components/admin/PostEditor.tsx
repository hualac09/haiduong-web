"use client";

import { deletePost, savePost } from "@/app/admin/actions";
import type { Post } from "@/lib/data";
import { Field, FormMessage, Submit, useForm } from "../forms";
import { ImageInput } from "./ImageInputs";

/** published_at (UTC "YYYY-MM-DD HH:MM:SS") → giá trị datetime-local theo giờ Việt Nam. */
function toLocalVN(utc: string | null) {
  if (!utc) return "";
  const d = new Date(utc.replace(" ", "T") + "Z");
  return new Date(d.getTime() + 7 * 3600_000).toISOString().slice(0, 16);
}

export default function PostEditor({ p }: { p?: Post }) {
  const [state, action] = useForm(savePost);
  return (
    <>
      <form action={action} className="grid gap-6 bg-paper p-5 md:p-8">
        {p && <input type="hidden" name="id" value={p.id} />}
        <Field name="title" label="Tiêu đề" state={state} required defaultValue={p?.title} />
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="slug" label="Đường dẫn (để trống: tự tạo)" state={state} defaultValue={p?.slug} />
          <Field name="topic" label="Chủ đề" state={state} defaultValue={p?.topic ?? "Thị trường"} hint="Ví dụ: Thị trường, Dự án, Nghề môi giới" />
        </div>
        <Field name="excerpt" label="Tóm tắt (hiện trên thẻ bài và Google)" state={state} rows={2} defaultValue={p?.excerpt} />
        <Field
          name="body"
          label="Nội dung (Markdown)"
          state={state}
          rows={18}
          defaultValue={p?.body}
          hint="## Tiêu đề mục · **đậm** · - gạch đầu dòng · [chữ](https://link) · > trích dẫn"
        />
        <ImageInput name="cover" label="Ảnh bìa" defaultValue={p?.cover} />
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={Boolean(p?.published)} className="h-5 w-5" /> Đăng công khai
          </label>
          <label className="field">
            <span>Thời điểm đăng (giờ VN, để trống = ngay)</span>
            <input type="datetime-local" name="published_at" defaultValue={toLocalVN(p?.published_at ?? null)} className="input" />
          </label>
        </div>
        <FormMessage state={state} />
        <div className="flex gap-3">
          <Submit className="btn btn-ink">Lưu</Submit>
          {p?.published ? (
            <a href={`/goc-nhin/${p.slug}`} target="_blank" className="btn btn-ghost">
              Xem trên web
            </a>
          ) : null}
        </div>
      </form>
      {p && (
        <form
          action={deletePost}
          className="mt-6"
          onSubmit={(e) => {
            if (!confirm(`Xóa vĩnh viễn bài "${p.title}"?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={p.id} />
          <button className="cursor-pointer text-sm text-danger underline">Xóa bài này</button>
        </form>
      )}
    </>
  );
}
