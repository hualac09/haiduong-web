import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { currentAdmin } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/db";

const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};
const MAX = 12 * 1024 * 1024;

/** Admin tải ảnh lên; trả về danh sách URL /uploads/... */
export async function POST(req: Request) {
  if (!(await currentAdmin())) return Response.json({ error: "unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const files = fd.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return Response.json({ error: "Chưa chọn ảnh." }, { status: 400 });

  const month = new Date().toISOString().slice(0, 7);
  const dir = path.join(UPLOAD_DIR, month);
  await fs.mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const f of files.slice(0, 20)) {
    const ext = EXT[f.type];
    if (!ext) return Response.json({ error: `${f.name}: chỉ nhận JPG, PNG, WebP, AVIF.` }, { status: 400 });
    if (f.size > MAX) return Response.json({ error: `${f.name}: ảnh lớn hơn 12MB.` }, { status: 400 });
    const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}${ext}`;
    await fs.writeFile(path.join(dir, name), Buffer.from(await f.arrayBuffer()));
    urls.push(`/uploads/${month}/${name}`);
  }
  return Response.json({ urls });
}
