"use client";

import { useCart } from "@/context/CartContext";

type Props = {
  product: {
    name: string;
    price: number;
    image: string;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
  addToCart({
    ...product,
    quantity: 1,
  })
}
      className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
    >
      Add to Cart
    </button>
  );
}