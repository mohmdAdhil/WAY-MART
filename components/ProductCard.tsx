type ProductCardProps = {
  name: string;
  price: string;
  image: string;
};

export default function ProductCard({
  name,
  price,
  image,
}: ProductCardProps) {
  return (
    <div className="border rounded-xl p-4 text-center shadow-sm">
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-lg"
      />

      <h3 className="mt-3 font-bold text-lg">{name}</h3>

      <p className="text-gray-600">{price}</p>

      <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg">
        Add to Cart
      </button>
    </div>
  );
}