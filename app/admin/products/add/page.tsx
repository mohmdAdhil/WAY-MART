"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fruits");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("0");
  const [saving, setSaving] = useState(false);

  async function handleAddProduct() {
  if (!name || !price || !imageFile || !stock) {
    alert("Please fill all required fields.");
    return;
  }

  setSaving(true);

  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, imageFile);

  if (uploadError) {
    alert(uploadError.message);
    setSaving(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  const { error } = await supabase.from("products").insert({
    name,
    price: Number(price),
    category,
    image: publicUrl,
    stock: Number(stock),
    discount: Number(discount),
  });

  if (error) {
    alert(error.message);
    setSaving(false);
    return;
  }

  alert("Product added successfully! 🎉");

  router.push("/admin/products");
}

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-extrabold">
          ➕ Add Product
        </h1>

        <p className="text-gray-500 mt-2">
          Add a new product to Way Mart.
        </p>

        <div className="bg-white rounded-3xl shadow-lg p-6 mt-8 space-y-5">

          {/* Product Name */}
          <div>
            <label className="font-semibold">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Example: Mango"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold">
              Price
            </label>

            <input
              type="number"
              placeholder="Example: 100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            >
              <option>Fruits</option>
              <option>Vegetables</option>
              <option>Dairy</option>
              <option>Snacks</option>
            </select>
          </div>

         {/* Product Image */}
<div>
  <label className="font-semibold">
    Product Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      setImageFile(e.target.files?.[0] || null);
    }}
    className="w-full border rounded-xl p-3 mt-2"
  />

  {imageFile && (
    <p className="text-sm text-green-600 mt-2">
      📸 {imageFile.name}
    </p>
  )}
</div>

          {/* Stock */}
          <div>
            <label className="font-semibold">
              Stock
            </label>

            <input
              type="number"
              placeholder="Example: 50"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="font-semibold">
              Discount (%)
            </label>

            <input
              type="number"
              placeholder="Example: 20"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">

            <button
              onClick={() => router.push("/admin/products")}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleAddProduct}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? "Adding..." : "➕ Add Product"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}