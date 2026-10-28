"use client";

import { login } from "@/app/admin/actions";
import { Field, FormMessage, Submit, useForm } from "../forms";

export default function LoginForm() {
  const [state, action] = useForm(login);
  return (
    <form action={action} className="grid gap-5">
      <Field name="email" label="Email" state={state} type="email" autoComplete="username" required />
      <Field name="password" label="Mật khẩu" state={state} type="password" autoComplete="current-password" required />
      <FormMessage state={state} />
      <Submit className="btn btn-gold w-full">Đăng nhập</Submit>
    </form>
  );
}
