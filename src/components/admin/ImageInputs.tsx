"use client";

import { useRef, useState } from "react";
import { Close } from "../icons";

async function upload(files: FileList): Promise<string[]> {
  const fd = new FormData();
  for (const f of Array.from(files)) fd.append("files", f);
  const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const j = (await r.json()) as { urls?: string[]; error?: string };
  if (!r.ok || !j.urls) throw new Error(j.error ?? "Tải ảnh thất bại.");
  return j.urls;
}

function useUploader() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (files: FileList | null, done: (urls: string[]) => void) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      done(await upload(files));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}

/** Một ảnh (ảnh bìa): dán URL hoặc tải lên. */
export function ImageInput({ name, label, defaultValue = "" }: { name: string; label: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const file = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUploader();
  return (
    <div className="field">
      <span>{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-line sm:w-48">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="grid flex-1 gap-2">
          <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} className="input" placeholder="Dán URL ảnh hoặc tải lên" />
          <div className="flex gap-2">
            <button type="button" className="btn btn-ink !min-h-[40px] !text-xs" onClick={() => file.current?.click()} disabled={busy}>
              {busy ? "Đang tải…" : "Tải ảnh lên"}
            </button>
            {url && (
              <button type="button" className="btn btn-ghost !min-h-[40px] !text-xs" onClick={() => setUrl("")}>
                Bỏ ảnh
              </button>
            )}
          </div>
          <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => run(e.target.files, (u) => setUrl(u[0]))} />
          {error && <small className="text-danger" role="alert">{error}</small>}
          <small className="opacity-70">Để trống: dùng ảnh bìa video YouTube.</small>
        </div>
      </div>
    </div>
  );
}

/** Nhiều ảnh (thư viện ảnh), lưu dạng JSON trong input ẩn. */
export function GalleryInput({ name, defaultValue = "[]" }: { name: string; defaultValue?: string }) {
  const [list, setList] = useState<string[]>(() => {
    try {
      return JSON.parse(defaultValue);
    } catch {
      return [];
    }
  });
  const file = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUploader();
  const move = (i: number, d: number) =>
    setList((l) => {
      const n = [...l];
      const j = i + d;
      if (j < 0 || j >= n.length) return l;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  return (
    <div className="field">
      <span>Thư viện ảnh</span>
      <input type="hidden" name={name} value={JSON.stringify(list)} />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {list.map((u, i) => (
          <li key={u} className="relative aspect-[4/3] overflow-hidden bg-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink-2/70 text-white">
              <button type="button" className="px-3 py-1.5 text-sm" onClick={() => move(i, -1)} aria-label="Lên trước">
                ←
              </button>
              <button type="button" className="px-3 py-1.5" onClick={() => setList((l) => l.filter((x) => x !== u))} aria-label="Xóa ảnh">
                <Close size={16} />
              </button>
              <button type="button" className="px-3 py-1.5 text-sm" onClick={() => move(i, 1)} aria-label="Ra sau">
                →
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button type="button" className="btn btn-ink !min-h-[40px] !text-xs" onClick={() => file.current?.click()} disabled={busy}>
          {busy ? "Đang tải…" : "Thêm ảnh"}
        </button>
      </div>
      <input
        ref={file}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={(e) => run(e.target.files, (u) => setList((l) => [...l, ...u]))}
      />
      {error && <small className="text-danger" role="alert">{error}</small>}
    </div>
  );
}
