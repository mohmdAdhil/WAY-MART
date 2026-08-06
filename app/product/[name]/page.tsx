
import { products } from "@/data/products";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { name } = await params;

  const product = products.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (!product) {
    return <h1>Product not found</h1>;
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

      <p className="text-yellow-500 mt-2">
        ⭐ 4.8 (250+ reviews)
      </p>

      <p className="mt-4 text-gray-600">
        Fresh quality {product.name} delivered to your doorstep in 10 minutes.
      </p>

      <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold">
        Add to Cart
      </button>
    </main>
  );
}