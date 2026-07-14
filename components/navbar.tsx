import Link from "next/link";
import {
  Search,
  Heart,
  MessageCircle,
  Plus ,
  Package,
} from "lucide-react";
import  UserMenu  from "./userMenu";

export default function Navbar(){
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          My Ecommerce
        </Link>

        {/* Search */}
        <div className="relative mx-8 flex-1 max-w-lg">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

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
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};