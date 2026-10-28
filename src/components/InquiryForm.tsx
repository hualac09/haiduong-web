"use client";

import { inquireListing } from "@/app/actions";
import { Field, FormMessage, Hidden, Submit, Success, useForm } from "./forms";

export default function InquiryForm({ listingId, title }: { listingId: number; title: string }) {
  const [state, action] = useForm(inquireListing);
  if (state.ok) return <Success message={state.message} />;
  return (
    <form action={action} className="relative grid gap-5" noValidate>
      <input type="hidden" name="listing_id" value={listingId} />
      <Hidden />
      <Field name="name" label="Họ tên" state={state} required autoComplete="name" />
      <Field name="phone" label="Số điện thoại / Zalo" state={state} required type="tel" inputMode="tel" autoComplete="tel" />
      <Field name="email" label="Email" state={state} type="email" inputMode="email" autoComplete="email" />
      <Field
        name="message"
        label="Lời nhắn"
        state={state}
        rows={3}
        defaultValue={`Tôi quan tâm ${title}. Vui lòng gửi thông tin hiện tại và lịch xem căn.`}
      />
      <FormMessage state={state} />
      <Submit>Nhận thông tin căn</Submit>
      <p className="text-xs opacity-70">Thông tin chỉ dùng để liên hệ về căn này, không chia sẻ cho bên thứ ba.</p>
    </form>
  );
}
