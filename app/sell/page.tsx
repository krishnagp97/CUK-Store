import ProductForm from "@/components/product/productForm";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function SellPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6C5CE7]/10 sm:h-16 sm:w-16">
          <svg
            className="h-7 w-7 text-[#6C5CE7] sm:h-8 sm:w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zM12 14v7m0 0H8m4 0h4M6 21V9a6 6 0 1112 0v12"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-xl font-bold text-[#1A1A2E] sm:text-2xl">
          Please sign in
        </h1>
        <p className="mt-2 text-sm text-[#1A1A2E]/50 sm:text-base">
          Login to sell your products.
        </p>

        <Button
          asChild
          className="mt-6 w-full rounded-full bg-[#1A1A2E] py-6 text-sm font-medium hover:bg-[#1A1A2E]/90 sm:w-auto sm:px-8"
        >
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">
          Sell an item
        </h1>
        <p className="mt-1 text-sm text-[#1A1A2E]/50">
          Fill in the details below to list your product.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}