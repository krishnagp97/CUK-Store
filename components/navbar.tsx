import Link from "next/link";
import { Search, Heart, MessageCircle, Plus, Package } from "lucide-react";
import UserMenu from "./userMenu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SearchBar from "./searchBar";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/cuk-logo.png"
            alt="CUK Store"
            width={160}
            height={50}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Search */}
        <SearchBar />

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/sell"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus size={20} />
            <span>Sell</span>
          </Link>
          <Link
            href="/wishList"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-red-50 hover:text-red-500"
          >
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>
          <Link
            href="/message"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-green-50 hover:text-green-600"
          >
            <MessageCircle size={20} />
            <span>Messages</span>
          </Link>
          <Link
            href="/myListings"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
          >
            <Package size={20} />
            <span>My Listings</span>
          </Link>
          {session ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
