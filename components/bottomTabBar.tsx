"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, MessageCircle, Plus, Package } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wishList", label: "Wishlist", icon: Heart },
  { href: "/sell", label: "Sell", icon: Plus, isPrimary: true },
  { href: "/message", label: "Messages", icon: MessageCircle },
  { href: "/myListings", label: "Listings", icon: Package },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  // Hide the tab bar on individual chat conversation screens
  const isChatConversation = /^\/message\/[^/]+/.test(pathname ?? "");

  if (isChatConversation) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E5EF] bg-white/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] supports-backdrop-filter:bg-white/80 lg:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-stretch justify-around px-2">
          {navLinks.map(({ href, label, icon: Icon, isPrimary }) =>
            isPrimary ? (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center justify-center gap-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#6C5CE7] to-[#8B7CF6] text-white shadow-sm shadow-[#6C5CE7]/40">
                  <Icon size={22} />
                </span>
              </Link>
            ) : (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center justify-center gap-1 text-[#1A1A2E]/50 transition active:text-[#6C5CE7]"
              >
                <Icon size={22} className="shrink-0" />
                <span className="text-[10px] font-medium leading-none">
                  {label}
                </span>
              </Link>
            ),
          )}
        </div>
      </div>

      {/* Spacer so page content isn't hidden behind fixed bottom bar on mobile */}
      <div className="h-16 lg:hidden" />
    </>
  );
}