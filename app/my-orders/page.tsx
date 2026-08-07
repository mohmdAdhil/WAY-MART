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
      .select(`
  *,
  order_items (
    product_name,
    price,
    quantity,
    image
  )
`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

   if (error) {
  console.error("Supabase Error:", error);
  alert(error.message);
  return;
}
    console.log(data);

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
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-all duration-300"
          >
          <div className="flex justify-between items-start mb-5">
  <div>
    <h2 className="text-xl font-bold">
      📦 Order #{order.id}
    </h2>


     <p className="text-sm text-gray-500">
  📅{" "}
  {new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}
  {" • "}
  {new Date(order.created_at).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })}

    </p>
  </div>

  <span
  className={`px-4 py-1 rounded-full text-sm font-semibold ${
    order.status === "Pending"
      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
      : order.status === "Confirmed"
      ? "bg-blue-100 text-blue-800 border border-blue-300"
      : order.status === "Out for Delivery"
      ? "bg-purple-100 text-purple-800 border border-purple-300"
      : order.status === "Delivered"
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-800 border border-red-300"
  }`}
>
  {order.status}
</span>
</div>

<div className="space-y-1 mb-4">
  <p><strong>👤</strong> {order.customer_name}</p>
  <p><strong>📞</strong> {order.phone}</p>
  <p><strong>📍</strong> {order.address}</p>
</div>
            <hr className="my-3" />

<h3 className="text-lg font-bold mb-3 border-b pb-2">
  🛍️ Products
</h3>

{order.order_items && order.order_items.length > 0 ? (
  order.order_items.map((item: any, index: number) => (
  <div
  key={index}
  className="flex justify-between items-center bg-gray-50 rounded-xl p-3 mb-3 hover:bg-gray-100 transition"
>
    <div className="flex items-center gap-3">
      <img
        src={item.image}
        alt={item.product_name}
        className="w-16 h-16 rounded-xl object-cover border"
      />

      <div>
        <p className="font-semibold text-gray-800">
  {item.product_name}
</p>
        <p className="text-sm text-gray-500">
          Qty: {item.quantity}
        </p>
      </div>
    </div>

   <p className="font-bold text-green-600">
  ₹{item.price}
</p>
  </div>
  ))
) : (
  <p className="text-gray-500">No products found.</p>
)}
<div className="border-t mt-4 pt-4 flex justify-between items-center">
  <p className="text-lg font-bold">💰 Total</p>

  <p className="text-xl font-bold text-green-600">
    ₹{order.total_price}
  </p>
</div>

          </div>
        ))
      )}
    </main>
  );
}