"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  discount: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading products...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold">
              📦 Manage Products
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage your Way Mart products.
            </p>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold">
            ➕ Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-lg p-5 border border-gray-100"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-2xl"
              />

              <h2 className="text-xl font-bold mt-4">
                {product.name}
              </h2>

              <p className="text-gray-500 mt-1">
                {product.category}
              </p>

              <p className="text-2xl font-bold text-green-600 mt-3">
                ₹{product.price}
              </p>

              <div className="flex justify-between mt-3 text-sm">
                <span>
                  📦 Stock: {product.stock}
                </span>

                <span>
                  🔥 {product.discount}% OFF
                </span>
              </div>

              <div className="flex gap-3 mt-5">

                <Link
  href={`/admin/products/edit/${product.id}`}
  className="flex-1 border border-green-600 text-green-600 py-2 rounded-xl font-semibold text-center"
>
  ✏️ Edit
</Link>

                <button
  onClick={async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product deleted successfully! 🗑️");

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== product.id)
    );
  }}
  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold"
>
  🗑️ Delete
</button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}