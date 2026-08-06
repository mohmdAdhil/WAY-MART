import { supabase } from "@/lib/supabase";
import { Product } from "@/types/cart";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function loadCart() {
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map((item) => ({
    name: item.product_name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  })) as Product[];
}