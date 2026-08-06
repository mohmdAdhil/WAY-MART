"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

 const total = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-4xl font-bold">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="mt-4 text-gray-600">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="mt-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 mb-3 flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>
  <h3 className="font-bold">
    {item.name} × {item.quantity}
  </h3>

  <p>
    ₹{item.price * item.quantity}
  </p>

  <div className="flex gap-3 mt-2">
    <button
      onClick={() => decreaseQuantity(item.name)}
      className="bg-gray-200 px-3 py-1 rounded"
    >
      -
    </button>

    <button
      onClick={() => increaseQuantity(item.name)}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      +
    </button>
    <button
  onClick={() => removeFromCart(item.name)}
  className="bg-red-600 text-white px-3 py-1 rounded"
>
  Remove
</button>
  </div>
</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-6">
            Total: ₹{total}
          </h2>
          <Link href="/checkout">
  <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
    Proceed to Checkout
  </button>
</Link>
        </>
      )}
    </main>
  );
}