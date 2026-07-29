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
    <div className="container mx-auto max-w-3xl py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {user.deleteRequested && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-600">
              Account Scheduled for Deletion
            </CardTitle>

            <CardDescription>
              Your account is scheduled for deletion on{" "}
              {user.deleteScheduledAt?.toLocaleDateString("en-IN")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <CancelDeletionButton />
          </CardContent>
        </Card>
      )}

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Name</p>
            <p className="text-muted-foreground">{user.name}</p>
          </div>

          <Separator />

          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Update your password and security settings.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button asChild variant="outline">
            <Link href="/settings/change-password">Change Password</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}
