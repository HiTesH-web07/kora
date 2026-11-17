"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/store/cart";

export function Toast() {
  const { toast } = useCart();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.p key={toast} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-burgundy px-5 py-3 text-sm text-cream shadow-lg">
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
