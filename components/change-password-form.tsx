"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";

import { changePasswordSchema } from "@/lib/validations/change-password";
import type { ChangePasswordValues } from "@/lib/validations/change-password";

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated successfully!");
    form.reset();
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword" className="text-sm font-medium">
          Current Password
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="currentPassword"
            type="password"
            className="rounded-xl pl-9"
            {...form.register("currentPassword")}
          />
        </div>
        {form.formState.errors.currentPassword && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword" className="text-sm font-medium">
          New Password
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="newPassword"
            type="password"
            className="rounded-xl pl-9"
            {...form.register("newPassword")}
          />
        </div>
        {form.formState.errors.newPassword && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            className="rounded-xl pl-9"
            {...form.register("confirmPassword")}
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="rounded-xl"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}