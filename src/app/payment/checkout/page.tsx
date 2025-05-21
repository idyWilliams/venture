"use client";

import { Suspense } from "react";
import CheckoutPageInner from "./CheckoutPageInner";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <CheckoutPageInner />
    </Suspense>
  );
}
