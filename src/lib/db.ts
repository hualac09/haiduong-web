import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "./schema";

// Thư mục dữ liệu nằm ngoài bản build (đặt bằng DATA_DIR trên VPS) nên không cần Turbopack lần theo.
export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(process.cwd(), "data"));
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");


declare global {
  // Giữ một kết nối duy nhất qua các lần hot reload khi chạy dev.
  var __hdDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "haiduong.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  return db;
}

export function db(): DatabaseSync {
  if (!globalThis.__hdDb) globalThis.__hdDb = open();
  return globalThis.__hdDb;
}

type Param = string | number | null;

// node:sqlite trả về object không có prototype; React không cho truyền loại này sang Client Component.
const plain = <T,>(row: unknown) => ({ ...(row as object) }) as T;

export function all<T>(sql: string, ...params: Param[]): T[] {
  return db().prepare(sql).all(...params).map((r) => plain<T>(r));
}

export function get<T>(sql: string, ...params: Param[]): T | undefined {
  const r = db().prepare(sql).get(...params);
  return r === undefined ? undefined : plain<T>(r);
}

export function run(sql: string, ...params: Param[]) {
  return db().prepare(sql).run(...params);
}

export function tx<T>(fn: () => T): T {
  const d = db();
  d.exec("BEGIN IMMEDIATE");
  try {
    const out = fn();
    d.exec("COMMIT");
    return out;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}
