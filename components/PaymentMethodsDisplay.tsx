"use client";

import { PaymentMethod } from "@/types";
import { useEffect, useState } from "react";
import { getPaymentMethods } from "@/lib/firestore";

export function PaymentMethodsDisplay() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const data = await getPaymentMethods();
      setMethods(data);
    } catch (error) {
      console.error("Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-white/60 py-4">Loading payment methods...</div>;
  }

  if (methods.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-white/70 uppercase tracking-wide">Available Payment Methods</p>
      <div className="grid gap-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md border border-white/20 rounded-xl p-4 hover:border-white/40 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-white text-lg">{method.name}</p>
                <p className="text-white/70 text-sm mt-1">{method.accountName}</p>
                <p className="text-white/60 text-sm font-mono mt-2">{method.accountNumber}</p>
                {method.reference && (
                  <p className="text-white/50 text-xs mt-1">📍 {method.reference}</p>
                )}
              </div>
              <div className="text-2xl ml-2">💳</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
