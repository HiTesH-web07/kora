import fs from "fs";
import path from "path";
import { DATA_PATH } from "./settings";
import type { Order, OrderStatus } from "./types";

/**
 * Orders are kept in one JSON file under DATA_DIR, so they survive restarts and redeploys.
 * Fine for a small shop on a single server; move to a database if volume grows.
 * There are no backups: export or forward orders (viaSocket does this) if you need a record.
 */
const FILE = path.join(DATA_PATH, "orders.json");
const MAX = 5000;

function load(): Order[] {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")) as Order[]; } catch { return []; }
}
function persist(list: Order[]) {
  fs.mkdirSync(DATA_PATH, { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list.slice(-MAX)), { mode: 0o600 });
  fs.renameSync(tmp, FILE);
}

export const getOrder = (id: string) => load().find((o) => o.orderId === id);
export const findByIdempotencyKey = (key: string) => load().find((o) => o.idempotencyKey === key);
export function saveOrder(o: Order) {
  persist([...load().filter((x) => x.orderId !== o.orderId), o]);
}
export function setStatus(id: string, status: OrderStatus) {
  const list = load();
  const o = list.find((x) => x.orderId === id);
  if (!o) return undefined;
  o.status = status;
  persist(list);
  return o;
}
