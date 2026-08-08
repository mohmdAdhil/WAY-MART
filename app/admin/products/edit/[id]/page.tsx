"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fruits");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("0");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        router.push("/admin/products");
        return;
      }

      setName(data.name);
      setPrice(String(data.price));
      setCategory(data.category);
      setImage(data.image);
      setStock(String(data.stock));
      setDiscount(String(data.discount ?? 0));

      setLoading(false);
    }

    loadProduct();
  }, [id, router]);

  async function handleUpdateProduct() {
  if (!name || !price || !stock) {
    alert("Please fill all required fields.");
    return;
  }

  setSaving(true);

  let imageUrl = image;

  if (imageFile) {
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

    imageUrl = publicUrl;
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      price: Number(price),
      category,
      image: imageUrl,
      stock: Number(stock),
      discount: Number(discount),
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    setSaving(false);
    return;
  }

  alert("Product updated successfully! 🎉");

  router.push("/admin/products");
}



  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading product...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-4xl font-extrabold">
          ✏️ Edit Product
        </h1>

        <p className="text-gray-500 mt-2">
          Update your Way Mart product.
        </p>

        <div className="bg-white rounded-3xl shadow-lg p-6 mt-8 space-y-5">

          <div>
            <label className="font-semibold">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

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

  {image && (
    <img
      src={image}
      alt={name}
      className="w-32 h-32 object-cover rounded-xl mt-3"
    />
  )}

  {imageFile && (
    <p className="text-sm text-green-600 mt-2">
      📸 New image: {imageFile.name}
    </p>
  )}
</div>

          <div>
            <label className="font-semibold">
              Stock
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Discount (%)
            </label>

            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div className="flex gap-3 pt-3">

            <button
              onClick={() => router.push("/admin/products")}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdateProduct}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}