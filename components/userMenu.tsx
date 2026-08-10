"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Settings, LogOut } from "lucide-react";

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/sign-in");
    router.refresh();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer ring-2 ring-transparent transition-all hover:ring-primary/20">
          <AvatarImage src="/" />

          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
            {session?.user?.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-xl p-2">
        <DropdownMenuLabel className="px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/" />
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {session?.user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold">{session?.user?.name}</p>

              <p className="truncate text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg py-2 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}