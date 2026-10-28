import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { Monogram } from "@/components/icons";
import { currentAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return (
    <main className="on-dark grid min-h-[100svh] place-items-center bg-ink px-4 text-white">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <Monogram size={36} />
          <span className="text-lg font-medium tracking-[0.14em] uppercase">Quản trị</span>
        </div>
        <h1 className="mt-10 text-3xl font-extralight">Đăng nhập</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
