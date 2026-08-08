"use client";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("cod");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
const [phone, setPhone] = useState("");
  const { cart, clearCart } = useCart();
const router = useRouter();

const totalPrice = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
const deliveryFee = totalPrice >= 349 ? 0 : 30;

const finalTotal = totalPrice + deliveryFee;

const placeOrder = async () => {
  if (!name.trim()) {
  alert("Please enter your full name.");
  return;
}

if (!phone.trim()) {
  alert("Please enter your phone number.");
  return;
}

if (!/^\d{10}$/.test(phone)) {
  alert("Please enter a valid 10-digit phone number.");
  return;
}

if (!address.trim()) {
  alert("Please enter your delivery address.");
  return;
}

if (cart.length === 0) {
  alert("Your cart is empty.");
  return;
}
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first");
    return;
  }



 const { data, error } = await supabase
  .from("orders")
 .insert({

  user_id: user.id,
  customer_name: name,
  phone: phone,
  subtotal: totalPrice,
  delivery_fee: deliveryFee,
  total_price: finalTotal,
  payment_method: payment,
  status: "Pending",
  address,
})
  .select()
  .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }
  const items = cart.map((item) => ({
  order_id: data.id,
  product_name: item.name,
  price: item.price,
  quantity: item.quantity,
  image: item.image,
}));

const { error: itemsError } = await supabase
  .from("order_items")
  .insert(items);

if (itemsError) {
  console.error(itemsError);
  alert(itemsError.message);
  return;
}
await supabase
  .from("cart")
  .delete()
  .eq("user_id", user.id);

clearCart();

  router.push("/order-success");
};

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">🛍️ Checkout</h1>

        <input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border rounded-lg p-3 mb-4"
/>

        <input
  type="tel"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="w-full border rounded-lg p-3 mb-4"
/>

        <textarea
  placeholder="Delivery Address"
  rows={4}
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  className="w-full border rounded-lg p-3 mb-4"
/>

<div className="bg-gray-50 rounded-xl p-4 mb-6">
  <div className="flex justify-between">
    <span>Subtotal</span>
    <span>₹{totalPrice}</span>
  </div>

  <div className="flex justify-between mt-2">
    <span>Delivery</span>
    <span>
      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
    </span>
  </div>

  <div className="border-t mt-3 pt-3 flex justify-between text-xl font-bold">
    <span>Total</span>
    <span>₹{finalTotal}</span>
  </div>
</div>



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

       <button
  onClick={placeOrder}
  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
>
  Place Order
</button>
      </div>
    </main>
  );
}