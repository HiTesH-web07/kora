export type PaymentMethod = "pay_online" | "whatsapp";

export interface OrderItemInput { id: string; qty: number }

export interface CustomerInput { name: string; whatsapp: string; address: string; notes?: string }

export interface OrderRequest {
  customer: CustomerInput;
  items: OrderItemInput[];
  paymentMethod: PaymentMethod;
  /** Client-generated key; resubmitting with the same key returns the same order. */
  idempotencyKey: string;
}

export type OrderStatus =
  | "received"            // stored and forwarded (or mock-accepted)
  | "pending_payment"     // pay_online chosen, waiting for the verified Razorpay webhook
  | "paid"                // confirmed by verified Razorpay webhook
  | "submission_failed";  // viaSocket forwarding failed

export interface OrderLine { id: string; name: string; qty: number; unitPrice: number; lineTotal: number }

export interface Order {
  orderId: string;
  idempotencyKey: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customer: CustomerInput;
  lines: OrderLine[];
  subtotal: number;
  total: number;
  mode: "mock" | "live";
}
