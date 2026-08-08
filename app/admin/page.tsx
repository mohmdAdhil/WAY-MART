"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Temporary admin check
      const adminEmail = "businessforlife08@gmail.com";

      if (user.email === adminEmail) {
  setIsAdmin(true);

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  setProductsCount(count || 0);
} else {
        router.push("/");
      }

      setChecking(false);
    }

    checkAdmin();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Checking access...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
  <main className="min-h-screen p-6">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          🛠️ Way Mart Admin
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your grocery store from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <p className="text-gray-500">📦 Products</p>
          <h2 className="text-4xl font-extrabold mt-2">
  {productsCount}
</h2>
          <p className="text-green-600 mt-2 font-semibold">
            Products in store
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <p className="text-gray-500">🛒 Orders</p>
          <h2 className="text-4xl font-extrabold mt-2">
            0
          </h2>
          <p className="text-orange-500 mt-2 font-semibold">
            Customer orders
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <p className="text-gray-500">👥 Customers</p>
          <h2 className="text-4xl font-extrabold mt-2">
            0
          </h2>
          <p className="text-blue-600 mt-2 font-semibold">
            Registered customers
          </p>
        </div>

      </div>

      {/* Quick Actions */}
      <section className="mt-10">

        <h2 className="text-2xl font-bold mb-5">
          ⚡ Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 text-left transition">
            <h3 className="text-2xl font-bold">
              ➕ Add Product
            </h3>

            <p className="mt-2 text-green-100">
              Add a new grocery product to Way Mart.
            </p>
          </button>

          <button className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl p-6 text-left transition">
            <h3 className="text-2xl font-bold">
              📦 Manage Products
            </h3>

            <p className="mt-2 text-gray-300">
              Edit prices, categories and discounts.
            </p>
          </button>

        </div>

      </section>

    </div>
  </main>
);
}