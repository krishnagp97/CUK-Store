
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import DeleteAccountButton from "@/components/deleteAccountButton";
import CancelDeletionButton from "@/components/cancelDeletionButton";

import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full px-3 pb-24 pt-4 sm:px-4 sm:pb-8 sm:pt-6 lg:pt-8">
      <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="border-b pb-4 sm:pb-6">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Settings
          </h1>

          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage your account and security settings.
          </p>
        </div>

        {/* Account Scheduled for Deletion */}
        {user.deleteRequested && (
          <Card className="rounded-2xl border-yellow-500/50 shadow-sm">
            <CardHeader className="space-y-1 p-4 sm:p-6">
              <CardTitle className="text-base text-yellow-600 sm:text-lg">
                Account Scheduled for Deletion
              </CardTitle>

              <CardDescription className="text-xs leading-5 sm:text-sm">
                Your account is scheduled for deletion on{" "}
                {user.deleteScheduledAt?.toLocaleDateString("en-IN")}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <CancelDeletionButton />
            </CardContent>
          </Card>
        )}

        {/* Account */}
        <Card className="rounded-2xl border-muted/60 shadow-sm">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Account
            </CardTitle>

            <CardDescription className="text-xs sm:text-sm">
              Manage your account information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            <div>
              <p className="text-sm font-medium sm:text-base">
                Name
              </p>

              <p className="mt-0.5 break-all text-xs text-muted-foreground sm:text-sm">
                {user.name}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium sm:text-base">
                Email
              </p>

              <p className="mt-0.5 break-all text-xs text-muted-foreground sm:text-sm">
                {user.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-2xl border-muted/60 shadow-sm">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Security
            </CardTitle>

            <CardDescription className="text-xs sm:text-sm">
              Update your password and security settings.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-full text-sm sm:h-11 sm:w-auto"
            >
              <Link href="/settings/change-password">
                Change Password
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-2xl border-red-200 shadow-sm">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-lg text-red-600 sm:text-xl">
              Danger Zone
            </CardTitle>

            <CardDescription className="text-xs sm:text-sm">
              Permanently delete your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="w-full sm:w-auto">
              <DeleteAccountButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

