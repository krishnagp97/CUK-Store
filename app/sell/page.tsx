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
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">Please sign in</h1>
        <p className="mt-2 text-muted-foreground">
          Login to sell your products.
        </p>

        <Button asChild className="mt-6">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <ProductForm />
    </div>
  );
}
