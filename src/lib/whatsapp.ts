import { formatPrice } from "./format";
import type { Order } from "./types";

/** Click-to-chat link to the bakery's number. Null when no number is configured yet. */
export function orderWhatsAppLink(number: string, order: Pick<Order, "orderId" | "lines" | "total"> & { customerName: string }): string | null {
  if (!number) return null;
  const lines = order.lines.map((l) => `${l.qty} x ${l.name}`).join("\n");
  const text = `Hi Kora! I just placed order ${order.orderId}.\n\n${lines}\n\nTotal: ${formatPrice(order.total)}\nName: ${order.customerName}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const generalWhatsAppLink = (number: string, msg = "Hi Kora! I'd like to know more about your menu.") =>
  number ? `https://wa.me/${number}?text=${encodeURIComponent(msg)}` : null;
