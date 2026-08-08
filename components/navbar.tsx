import Link from "next/link";
import { Home, Heart, MessageCircle, Plus, Package } from "lucide-react";
import UserMenu from "./userMenu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SearchBar from "./searchBar";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/wishList", label: "Wishlist", icon: Heart },
    { href: "/sell", label: "Sell", icon: Plus, isPrimary: true },
    { href: "/message", label: "Messages", icon: MessageCircle },
    { href: "/myListings", label: "Listings", icon: Package },
  ];

  return (
    <>
      {/* Top bar — all screens */}
      <nav className="sticky top-0 z-50 border-b border-[#E5E5EF] bg-white/80 backdrop-blur-lg supports-backdrop-filter:bg-white/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/cuk-logo.png"
              alt="CUK Store"
              width={160}
              height={50}
              className="h-8 w-auto object-contain sm:h-10 lg:h-12"
              priority
            />
          </Link>

          {/* Search — visible from tablet up */}
          <div className="hidden flex-1 max-w-md md:block">
            <SearchBar />
          </div>

          {/* Desktop nav links — hidden on mobile, shown from lg */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ href, label, icon: Icon, isPrimary }) =>
              isPrimary ? (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#8B7CF6] px-4 py-2 text-sm font-medium text-white shadow-sm shadow-[#6C5CE7]/30 transition hover:shadow-md hover:shadow-[#6C5CE7]/40"
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{label}</span>
                </Link>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-[#1A1A2E]/70 transition hover:bg-[#6C5CE7]/10 hover:text-[#6C5CE7]"
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{label}</span>
                </Link>
              ),
            )}
          </div>

          {/* Auth / user — all screens */}
          {session ? (
            <div className="flex shrink-0 items-center lg:ml-2 lg:border-l lg:border-[#E5E5EF] lg:pl-3">
              <UserMenu />
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-2 lg:ml-2 lg:border-l lg:border-[#E5E5EF] lg:pl-3">
              <Link
                href="/sign-in"
                className="rounded-full px-2.5 py-1.5 text-xs font-medium text-[#1A1A2E]/70 transition hover:bg-[#F7F7FB] hover:text-[#1A1A2E] sm:px-3 sm:py-2 sm:text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#1A1A2E] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#1A1A2E]/90 sm:px-4 sm:py-2 sm:text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Search row — mobile & tablet only, hidden once desktop nav shows */}
        <div className="border-t border-[#E5E5EF] px-4 py-2 md:hidden">
          <SearchBar />
        </div>
      </nav>

      {/* Bottom tab bar — mobile & tablet only, hidden at lg where top nav takes over */}
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