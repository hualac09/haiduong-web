"use client";

import { useMemo, useState } from "react";
import { bookSlot } from "@/app/actions";
import { Field, FormMessage, Hidden, Submit, Success, useForm } from "./forms";

type Slot = { id: number; day: string; date: string; time: string };

const PURPOSES = [
  ["mua", "Mua căn"],
  ["ban", "Bán / ký gửi"],
  ["thue", "Thuê / cho thuê"],
  ["hoc", "Học viện"],
  ["khac", "Việc khác"],
] as const;

export default function BookingForm({ slots, purpose }: { slots: Slot[]; purpose?: string }) {
  const [state, action] = useForm(bookSlot);
  const days = useMemo(() => {
    const m = new Map<string, Slot[]>();
    for (const s of slots) m.set(s.date, [...(m.get(s.date) ?? []), s]);
    return [...m.entries()];
  }, [slots]);
  const [day, setDay] = useState(days[0]?.[0] ?? "");
  const [slotId, setSlotId] = useState(state.data?.slot_id ?? "");
  const [p, setP] = useState(state.data?.purpose ?? purpose ?? "mua");

  if (state.ok) return <Success message={state.message} />;

  const daySlots = days.find(([d]) => d === day)?.[1] ?? [];
  const err = state.errors;

  return (
    <form action={action} className="relative grid gap-10" noValidate>
      <Hidden />
      <fieldset>
        <legend className="label text-gold-deep">1. Bạn cần trao đổi về</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {PURPOSES.map(([v, label]) => (
            <label
              key={v}
              className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                p === v ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
              }`}
            >
              <input type="radio" name="purpose" value={v} checked={p === v} onChange={() => setP(v)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label text-gold-deep">2. Chọn thời gian (giờ Việt Nam, 45 phút qua Zalo hoặc gặp trực tiếp)</legend>
        {days.length === 0 ? (
          <p className="mt-4 bg-mist p-5 text-muted">Lịch tuần này đã kín. Gửi thông tin bên dưới, trợ lý sẽ gọi hẹn giờ khác.</p>
        ) : (
          <>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Ngày">
              {days.map(([d, list]) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  aria-pressed={day === d}
                  className={`min-h-[64px] min-w-[112px] shrink-0 cursor-pointer border px-4 py-3 text-left transition-colors ${
                    day === d ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                  }`}
                >
                  <span className="block text-sm">{list[0].day.split(",")[0]}</span>
                  <span className="block text-lg font-light">{list[0].day.split(", ")[1]}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Giờ">
              {daySlots.map((s) => (
                <label
                  key={s.id}
                  className={`flex min-h-[48px] cursor-pointer items-center justify-center border text-lg font-light transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                    String(s.id) === slotId ? "border-gold bg-gold text-ink-2" : "border-line hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="slot_id"
                    value={s.id}
                    checked={String(s.id) === slotId}
                    onChange={() => setSlotId(String(s.id))}
                    className="sr-only"
                  />
                  {s.time}
                </label>
              ))}
            </div>
          </>
        )}
        {err?.slot_id && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {err.slot_id}
          </p>
        )}
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="label mb-4 text-gold-deep">3. Thông tin liên hệ</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="name" label="Họ tên" state={state} required autoComplete="name" />
          <Field name="phone" label="Số điện thoại / Zalo" state={state} required type="tel" inputMode="tel" autoComplete="tel" />
        </div>
        <Field name="email" label="Email" state={state} type="email" inputMode="email" autoComplete="email" />
        <Field
          name="note"
          label="Bạn muốn trao đổi gì?"
          state={state}
          rows={3}
          placeholder="Ví dụ: tìm penthouse Thủ Thiêm 3–4 phòng ngủ, ngân sách 80–120 tỷ, ở thật."
        />
      </fieldset>

      <FormMessage state={state} />
      <div>
        <Submit className="btn btn-ink">Giữ lịch hẹn</Submit>
      </div>
    </form>
  );
}
