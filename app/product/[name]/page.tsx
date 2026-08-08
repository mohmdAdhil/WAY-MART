"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  discount: number;
};

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const productName = Array.isArray(params.name)
  ? params.name[0]
  : params.name || "";

  useEffect(() => {
    async function getProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", productName)
        .single();

      if (error) {
        console.error("Error loading product:", error);
        setProduct(null);
      } else {
        setProduct(data);
      }

      setLoading(false);
    }

    if (productName) {
      getProduct();
    }
  }, [productName]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading product...
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Product not found
        </h1>
      </main>
    );
  }

  return (
    <main className="p-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-64 h-64 object-cover rounded-xl"
      />

      <h1 className="text-3xl font-bold mt-6">
        {product.name}
      </h1>

      <p className="text-2xl text-green-600 font-semibold mt-2">
        ₹{product.price}
      </p>

      {product.discount > 0 && (
        <span className="inline-block mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
          🔥 {product.discount}% OFF
        </span>
      )}

      <p className="text-yellow-500 mt-2">
        ⭐ 4.8 (250+ reviews)
      </p>

      <p className="mt-4 text-gray-600">
        Fresh quality {product.name} delivered to your doorstep in 10 minutes.
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
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
      >
        🛒 Add to Cart
      </button>
    </main>
  );
}