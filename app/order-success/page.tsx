import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with Way Mart.
          Your order has been received and will be delivered soon.
        </p>

        <Link href="/">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
            Continue Shopping
          </button>
        </Link>
      </div>
    </main>
  );
}