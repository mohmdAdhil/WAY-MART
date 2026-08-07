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
  clearCart: () => void;
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
  const updatedCart = cart.map((product) =>
    product.name === item.name
      ? {
          ...product,
          quantity: product.quantity + 1,
        }
      : product
  );

  setCart(updatedCart);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const updatedProduct = updatedCart.find(
    (product) => product.name === item.name
  );

  if (!updatedProduct) return;

  const { error } = await supabase
    .from("cart")
    .update({
      quantity: updatedProduct.quantity,
    })
    .eq("user_id", user.id)
    .eq("product_name", item.name);

  if (error) {
    console.error(error);
    alert(error.message);
  }

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

  const decreaseQuantity = async (name: string) => {
  const product = cart.find((item) => item.name === name);

  if (!product) return;

  if (product.quantity === 1) {
    removeFromCart(name);
    return;
  }

  const updatedCart = cart.map((item) =>
    item.name === name
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );

  setCart(updatedCart);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("cart")
    .update({ quantity: product.quantity - 1 })
    .eq("user_id", user.id)
    .eq("product_name", name);

  if (error) {
    console.error(error);
    alert(error.message);
  }
};

  const removeFromCart = async (name: string) => {
  setCart(cart.filter((item) => item.name !== name));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", user.id)
    .eq("product_name", name);

  if (error) {
    console.error(error);
    alert(error.message);
  }
};
const clearCart = () => {
  setCart([]);
};

  return (
    <CartContext.Provider
    value={{
  cart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
}}
    >
      {children}
    </CartContext.Provider>
  );
}