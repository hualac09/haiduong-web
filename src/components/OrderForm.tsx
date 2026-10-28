"use client";

import { useState } from "react";
import { createOrder } from "@/app/actions";
import { Field, FormMessage, Hidden, Submit, useForm } from "./forms";

type Plan = { id: string; name: string; price: string };

export default function OrderForm({ plans, initial }: { plans: Plan[]; initial: string }) {
  const [state, action] = useForm(createOrder);
  const [plan, setPlan] = useState(state.data?.plan || initial);
  const err = state.errors;

  return (
    <form action={action} className="relative grid gap-8" noValidate>
      <Hidden />
      <fieldset>
        <legend className="label text-gold-deep">1. Chọn gói</legend>
        <div className="mt-4 grid gap-3">
          {plans.map((p) => (
            <label
              key={p.id}
              className={`flex min-h-[64px] cursor-pointer items-center justify-between gap-4 border p-5 transition-colors ${
                plan === p.id ? "border-ink bg-gold-soft" : "border-line hover:border-ink/50"
              }`}
            >
              <span className="flex items-center gap-4">
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={plan === p.id}
                  onChange={() => setPlan(p.id)}
                  className="h-5 w-5 accent-[var(--color-ink)]"
                />
                <span className="text-lg font-light">{p.name}</span>
              </span>
              <span className="text-lg font-normal whitespace-nowrap">{p.price}</span>
            </label>
          ))}
        </div>
        {err?.plan && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {err.plan}
          </p>
        )}
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="label mb-4 text-gold-deep">2. Thông tin học viên</legend>
        <Field name="name" label="Họ tên" state={state} required autoComplete="name" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="phone" label="Số điện thoại / Zalo" state={state} required type="tel" inputMode="tel" autoComplete="tel" />
          <Field
            name="email"
            label="Email"
            state={state}
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            hint="Nhận xác nhận và link vào lớp."
          />
        </div>
        <label className="field">
          <span>Bạn đang bán phân khúc nào?</span>
          <select name="segment" className="input" defaultValue={state.data?.segment ?? ""}>
            <option value="">Chọn (không bắt buộc)</option>
            <option>Căn hộ trung cấp</option>
            <option>Cao cấp / hạng sang</option>
            <option>Đất nền, nhà phố</option>
            <option>Chưa làm môi giới</option>
          </select>
        </label>
        <Field name="note" label="Ghi chú" state={state} rows={2} placeholder="Ví dụ: xuất hóa đơn công ty, đăng ký nhóm…" />
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="agree"
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-ink)]"
            aria-invalid={err?.agree ? true : undefined}
          />
          <span>
            Tôi đồng ý để Hải Đường Academy liên hệ qua Zalo, điện thoại, email về khóa học. Thông tin không được chia sẻ cho bên
            thứ ba.
          </span>
        </label>
        {err?.agree && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {err.agree}
          </p>
        )}
      </div>

      <FormMessage state={state} />
      <Submit className="btn btn-ink w-full sm:w-auto">Tiếp tục thanh toán</Submit>
    </form>
  );
}
