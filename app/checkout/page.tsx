"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("cod");

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">🛍️ Checkout</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <textarea
          placeholder="Delivery Address"
          rows={4}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <h2 className="text-xl font-bold mb-3">Payment Method</h2>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            checked={payment === "cod"}
            onChange={() => setPayment("cod")}
          />
          Cash on Delivery
        </label>

        <label className="flex items-center gap-2 mb-6">
          <input
            type="radio"
            checked={payment === "online"}
            onChange={() => setPayment("online")}
          />
          Online Payment
        </label>

        <Link href="/order-success">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
            Place Order
          </button>
        </Link>
      </div>
    </main>
  );
}