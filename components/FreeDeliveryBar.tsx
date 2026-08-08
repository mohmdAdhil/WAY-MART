"use client";

import { useCart } from "@/context/CartContext";

export default function FreeDeliveryBar() {
  const { cart } = useCart();

  const deliveryLimit = 349;

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const remaining = deliveryLimit - cartTotal;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-green-100 border-t border-green-300 py-3 text-center font-bold text-green-700 shadow-lg z-50">
     {cart.length === 0 ? (
  <>🚚 Free delivery on orders above ₹349</>
) : remaining > 0 ? (
  <>🚚 Add ₹{remaining} more to unlock FREE DELIVERY</>
) : (
  <>🎉 FREE DELIVERY UNLOCKED!</>
)}
    </div>
  );
}