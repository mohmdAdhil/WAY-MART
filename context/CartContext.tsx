"use client";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/cart";
import { loadCart } from "@/lib/cartService";

type CartContextType = {
  cart: Product[];
  addToCart: (item: Product) => void;
  increaseQuantity: (name: string) => void;
  decreaseQuantity: (name: string) => void;
  removeFromCart: (name: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  useEffect(() => {
  async function fetchCart() {
    const items = await loadCart();
    setCart(items);
  }

  fetchCart();
}, []);

  const addToCart = async (item: Product) => {
  const existingItem = cart.find(
    (product) => product.name === item.name
  );

  if (existingItem) {
    setCart(
      cart.map((product) =>
        product.name === item.name
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product
      )
    );
  } else {
    setCart([
      ...cart,
      {
        ...item,
        quantity: 1,
      },
    ]);
    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return;

const { error } = await supabase.from("cart").insert({
  user_id: user.id,
  product_name: item.name,
  price: item.price,
  image: item.image,
  quantity: 1,
});

if (error) {
  console.error(error);
  alert(error.message);
}
  }
};

 const increaseQuantity = async (name: string) => {
  const updatedCart = cart.map((product) =>
    product.name === name
      ? { ...product, quantity: product.quantity + 1 }
      : product
  );

  setCart(updatedCart);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const product = updatedCart.find((item) => item.name === name);

  if (!product) return;

  const { error } = await supabase
    .from("cart")
    .update({ quantity: product.quantity })
    .eq("user_id", user.id)
    .eq("product_name", name);

  if (error) {
    console.error(error);
    alert(error.message);
  }
};

  const decreaseQuantity = (name: string) => {};

  const removeFromCart = (name: string) => {};

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}