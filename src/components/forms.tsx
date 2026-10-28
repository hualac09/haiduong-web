"use client";

import { useActionState, useEffect, useId, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/validate";
import { Check } from "./icons";

type Action = (s: FormState, fd: FormData) => Promise<FormState>;

export function Field({
  name,
  label,
  state,
  type = "text",
  required,
  hint,
  autoComplete,
  inputMode,
  rows,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  state: FormState;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text";
  rows?: number;
  defaultValue?: string;
  placeholder?: string;
}) {
  const id = useId();
  const err = state.errors?.[name];
  const describedBy = [hint && `${id}-hint`, err && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    className: "input",
    "aria-invalid": err ? true : undefined,
    "aria-describedby": describedBy,
    defaultValue: state.data?.[name] ?? defaultValue,
    placeholder,
  };
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {rows ? (
        <textarea {...common} rows={rows} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} inputMode={inputMode} />
      )}
      {hint && (
        <small id={`${id}-hint`} className="text-sm opacity-70">
          {hint}
        </small>
      )}
      {err && (
        <small id={`${id}-err`} className="text-sm text-danger [.on-dark_&]:text-[#f2b8b5]" role="alert">
          {err}
        </small>
      )}
    </div>
  );
}

export function Submit({ children, className = "btn btn-gold" }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? "Đang gửi…" : children}
    </button>
  );
}

/** Ô bẫy bot + tham số nguồn quảng cáo đọc từ URL. */
export function Hidden() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => setParams(new URLSearchParams(window.location.search)), []);
  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {["utm_source", "utm_medium", "utm_campaign", "ref"].map((k) => (
        <input key={k} type="hidden" name={k} value={params?.get(k) ?? ""} readOnly />
      ))}
    </>
  );
}

export function Success({ message }: { message?: string }) {
  return (
    <div role="status" className="flex items-start gap-4 border border-ok/40 bg-ok/10 p-6">
      <Check size={24} className="mt-0.5 shrink-0 text-ok [.on-dark_&]:text-gold" />
      <p>{message ?? "Đã gửi thành công."}</p>
    </div>
  );
}

export function useForm(action: Action) {
  return useActionState(action, {} as FormState);
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message || state.ok) return null;
  return (
    <p role="alert" className="border border-danger/40 bg-danger/10 p-4 text-sm">
      {state.message}
    </p>
  );
}
