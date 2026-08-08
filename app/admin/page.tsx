"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
      <h1 className="text-4xl font-extrabold">
        🛠️ Way Mart Admin
      </h1>

      <p className="text-gray-500 mt-2">
        Manage your store from here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold">📦 Products</h2>
          <p className="text-gray-500 mt-2">
            Add and manage products.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold">🛒 Orders</h2>
          <p className="text-gray-500 mt-2">
            Manage customer orders.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold">👥 Customers</h2>
          <p className="text-gray-500 mt-2">
            View your customers.
          </p>
        </div>
      </div>
    </main>
  );
}