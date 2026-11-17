import { readSettings } from "./settings";
import { orderTargets, postToTargets } from "./automations";
import type { Order } from "./types";

/**
 * Sends each new order to viaSocket (server-side only).
 * Live mode posts our own structured order JSON to every active automation the owners
 * published on /admin, plus the optional manual webhook URL. Replies are not parsed;
 * any 2xx counts as accepted. Mock mode sends nothing.
 */
export const orderMode = (): "mock" | "live" => readSettings().orderMode;

export function buildPayload(order: Order) {
  return {
    orderId: order.orderId, createdAt: order.createdAt, paymentMethod: order.paymentMethod,
    customer: order.customer, items: order.lines, subtotal: order.subtotal, total: order.total, currency: "INR",
  };
}

export async function submitOrderToViaSocket(order: Order): Promise<{ ok: true } | { ok: false; error: string }> {
  if (orderMode() === "mock") {
    console.info("[viasocket:mock] order accepted locally", order.orderId);
    return { ok: true };
  }
  if (orderTargets().length === 0) return { ok: false, error: "No active automation or webhook URL is set up in /admin." };
  const results = await postToTargets(buildPayload(order));
  const failed = results.filter((r) => !r.ok);
  if (failed.length) console.error("[viasocket] some targets failed:", failed.map((f) => `${f.label}:${f.status}`).join(", "));
  // The order counts as sent when at least one automation accepted it.
  return results.some((r) => r.ok) ? { ok: true } : { ok: false, error: `viaSocket did not accept the order (${failed.map((f) => f.status).join(", ")}).` };
}
