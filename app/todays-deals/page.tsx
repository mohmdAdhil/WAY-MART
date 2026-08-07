"use client";

import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import Link from "next/link";

export default function TodaysDealsPage() {

    const { addToCart } = useCart();
  return (
    <main className="min-h-screen bg-orange-50 p-6">
     {/* Mega Sale Banner */}
<div className="mb-10 rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-8 shadow-2xl">

  <p className="uppercase tracking-[4px] text-sm font-bold">
    🔥 WAY MART MEGA SALE
  </p>

  <h1 className="text-5xl font-extrabold mt-3">
    💥 SAVE UP TO 40%
  </h1>

  <p className="mt-3 text-xl text-orange-100">
    Fresh Groceries Delivered Every Day
  </p>

  <div className="flex flex-wrap gap-4 mt-6 text-sm font-semibold">
    <span className="bg-white/20 px-4 py-2 rounded-full">
      ⚡ Fast Delivery
    </span>

    <span className="bg-white/20 px-4 py-2 rounded-full">
      🥬 Fresh Products
    </span>

    <span className="bg-white/20 px-4 py-2 rounded-full">
      💰 Best Prices
    </span>
  </div>

  <button
    className="mt-8 bg-white text-red-600 px-8 py-3 rounded-2xl font-bold hover:scale-105 transition"
  >
    🛍️ Explore Deals
  </button>

  <p className="mt-5 text-orange-100 font-semibold">
    ⏳ Limited Time Offer
  </p>

</div>
<div className="mb-6">
  <h2 className="text-3xl font-bold text-gray-900">
    ✨ Featured Deals
  </h2>

  <p className="text-gray-500 mt-2">
    Hand-picked offers just for you.
  </p>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {products
  .filter((product) => product.discount > 0)
  .map((product) => (
    <div
      key={product.name}
     className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 p-5 border border-gray-100"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-xl"
      />

      <h2 className="text-xl font-bold mt-4">
        {product.name}
      </h2>
      <p className="text-yellow-500 mt-1">
  ⭐ 4.8 (250+)
</p>

     <p className="text-gray-500 line-through">
  ₹
  {Math.round(
    product.price / (1 - product.discount / 100)
  )}
</p>

      <p className="text-2xl font-bold text-green-600">
        ₹{product.price}
      </p>

      <span className="inline-block mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
       🔥 {product.discount}% OFF
      </span>
      <p className="text-sm text-red-600 font-semibold mt-2">
  ⏳ Limited Time Offer
</p>
      <button
  onClick={() =>
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }
  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold"
>
  🛒 Add to Cart
</button>

<Link
  href={`/product/${product.name.toLowerCase()}`}
  className="mt-2 block w-full text-center border border-green-600 text-green-600 py-2 rounded-xl font-semibold hover:bg-green-50"
>
  👀 View Product
</Link>

    </div>
  ))}
</div>

      <Link
        href="/"
        className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-xl"
      >
        ⬅ Back to Home
      </Link>
    </main>
  );
}