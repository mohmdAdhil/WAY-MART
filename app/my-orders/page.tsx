"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow p-4 mb-4"
          >
            <h2 className="font-bold">Order #{order.id}</h2>

            <p>👤 {order.customer_name}</p>
            <p>📞 {order.phone}</p>
            <p>📍 {order.address}</p>
            <p>💰 ₹{order.total_price}</p>
            <p>📦 {order.status}</p>
          </div>
        ))
      )}
    </main>
  );
}