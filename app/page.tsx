"use client";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
export default function Home() {
  const { cart, addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userName, setUserName] = useState("");
 useEffect(() => {
  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserName((user.user_metadata?.full_name as string) || "User");
    }
  }

  getUser();
}, []);
async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = "/login";
}

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
     <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex items-center justify-between">
  <div>
  <h1 className="text-3xl font-bold text-green-600">Way Mart</h1>

  <p className="text-sm text-gray-500">
    📍 Delivering in 10 minutes
  </p>

  {userName && (
  <p className="text-sm text-green-600 font-medium mt-1">
    👋 Hi, {userName}
  </p>
)}
  </div>
  <input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mt-6 w-full max-w-md border rounded-lg p-3"
/>
<div className="flex items-center gap-3">
  <Link
    href="/cart"
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
  >
    🛒 Cart ({cart.length})
  </Link>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold"
  >
    Logout
  </button>
</div>
 
  
</header>
    

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold">
          Groceries Delivered in Minutes
        </h2>

        <p className="text-gray-600 mt-4 text-lg">
          Fresh fruits, vegetables, snacks and daily essentials.
        </p>
        

        <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl text-lg">
          Shop Now
        </button>
      </section>
      <section className="p-6">
  <div className="bg-green-600 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between">
    <div>
      <h2 className="text-4xl font-bold">
        Fresh Groceries Delivered in 10 Minutes 🚀
      </h2>

      <p className="mt-3 text-lg">
        Up to 30% OFF on Fruits, Vegetables & Daily Essentials.
      </p>

      <button className="mt-5 bg-white text-green-600 px-6 py-3 rounded-xl font-bold">
        Shop Now
      </button>
    </div>

    <div className="text-7xl mt-6 md:mt-0">
      🛒🥦🍎🥛
    </div>
  </div>
</section>

     {/* Categories */}
<section className="p-6">
  <h3 className="text-2xl font-bold mb-6">Categories</h3>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    <div
  onClick={() => setSelectedCategory("All")}
  className="border rounded-xl p-6 text-center cursor-pointer hover:bg-green-100"
>
  🛍️ All
</div>
    <div
  onClick={() => setSelectedCategory("Vegetables")}
  className="border rounded-xl p-6 text-center cursor-pointer hover:bg-green-100"
>
  🥦 Vegetables
</div>

<div
  onClick={() => setSelectedCategory("Fruits")}
  className="border rounded-xl p-6 text-center cursor-pointer hover:bg-green-100"
>
  🍎 Fruits
</div>

<div
  onClick={() => setSelectedCategory("Dairy")}
  className="border rounded-xl p-6 text-center cursor-pointer hover:bg-green-100"
>
  🥛 Dairy
</div>

<div
  onClick={() => setSelectedCategory("Snacks")}
  className="border rounded-xl p-6 text-center cursor-pointer hover:bg-green-100"
>
  🍪 Snacks
</div>
</div>
</section>


{/* Popular Products */}
<section className="p-6">
  <h3 className="text-2xl font-bold mb-6">Popular Products</h3>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {products
  .filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  })
  .map((product) => (
    <div
  key={product.name}
  className="border rounded-2xl p-4 bg-white shadow-md hover:shadow-xl transition duration-300 text-center"
>
        <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          ⚡ 10 min
        </div>

        <Link href={`/product/${product.name.toLowerCase()}`}>
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-32 object-cover rounded-lg"
  />
</Link>

        <Link href={`/product/${product.name.toLowerCase()}`}>
  <h4 className="font-bold mt-3 hover:text-green-600">
    {product.name}
  </h4>
</Link>
        <div className="mt-2">
          <p className="font-semibold text-lg">
            ₹{product.price}
          </p>

          <p className="text-yellow-500 text-sm">
            ⭐ 4.8 (250+)
          </p>
        </div>

      <button
  onClick={() => {
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition"
        >
          Add to Cart
        </button>
      </div>
   
  ))}
  </div>
</section>
</main>
);
}