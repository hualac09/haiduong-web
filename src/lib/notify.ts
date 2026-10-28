import "server-only";

const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

/** Gửi tin vào Telegram của anh Đường. Không có cấu hình thì bỏ qua, không làm hỏng luồng chính. */
export async function notify(title: string, lines: Record<string, string | number | undefined>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const body = Object.entries(lines)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<b>${esc(k)}:</b> ${esc(String(v))}`)
    .join("\n");
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: `<b>${esc(title)}</b>\n${body}`, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (e) {
    console.error("telegram notify failed", e);
  }
}
