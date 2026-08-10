import ProductForm from "@/components/product/productForm";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { PackagePlus } from "lucide-react";

export default async function SellPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <main className="min-h-screen bg-[#F7F7FB] pb-24 sm:pb-28 lg:pb-8">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-2xl items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
          <div className="w-full rounded-2xl border border-[#E5E5EF] bg-white p-5 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#6C5CE7]/10 sm:h-16 sm:w-16">
              <PackagePlus className="h-6 w-6 text-[#6C5CE7] sm:h-7 sm:w-7" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-[#1A1A2E] sm:mt-5 sm:text-2xl">
              Please sign in
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm text-[#1A1A2E]/50 sm:text-base">
              Login to sell your products.
            </p>

            <Button
              asChild
              className="mt-5 h-11 w-full rounded-full bg-[#1A1A2E] px-6 text-sm font-medium hover:bg-[#1A1A2E]/90 sm:mt-6 sm:w-auto"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7FB] pb-24 sm:pb-28 lg:pb-8">
      <div className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-8 lg:px-8">
        {/* Header */}
        <header className="mb-5 sm:mb-7">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6C5CE7]/10 sm:h-11 sm:w-11">
              <PackagePlus className="h-5 w-5 text-[#6C5CE7]" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-extrabold tracking-tight text-[#1A1A2E] sm:text-2xl md:text-3xl">
                Sell an item
              </h1>

              <p className="mt-1 text-xs leading-5 text-[#1A1A2E]/50 sm:text-sm">
                List your product on Campus Marketplace.
              </p>
            </div>
          </div>
        </header>

        {/* Form */}
        <section className="w-full rounded-2xl border border-[#E5E5EF] bg-white p-3 shadow-sm sm:p-5 md:p-6">
          <ProductForm />
        </section>
      </div>
    </main>
  );
}