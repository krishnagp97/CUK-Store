
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5 sm:space-y-6"
    >
      {/* Current Password */}
      <div>
        <Label
          htmlFor="currentPassword"
          className="text-sm font-medium text-[#1A1A2E]"
        >
          Current Password
        </Label>

        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A2E]/40" />

          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            className="h-11 w-full rounded-xl border-[#E5E5EF] bg-white pl-10 text-sm transition-all focus-visible:border-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20 focus-visible:ring-offset-0"
            {...form.register("currentPassword")}
          />
        </div>

        {form.formState.errors.currentPassword && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New Password */}
      <div>
        <Label
          htmlFor="newPassword"
          className="text-sm font-medium text-[#1A1A2E]"
        >
          New Password
        </Label>

        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A2E]/40" />

          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="h-11 w-full rounded-xl border-[#E5E5EF] bg-white pl-10 text-sm transition-all focus-visible:border-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20 focus-visible:ring-offset-0"
            {...form.register("newPassword")}
          />
        </div>

        {form.formState.errors.newPassword && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-[#1A1A2E]"
        >
          Confirm Password
        </Label>

        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A2E]/40" />

          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="h-11 w-full rounded-xl border-[#E5E5EF] bg-white pl-10 text-sm transition-all focus-visible:border-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20 focus-visible:ring-offset-0"
            {...form.register("confirmPassword")}
          />
        </div>

        {form.formState.errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Update Button */}
      <div className="pt-1 sm:pt-0">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-12 w-full rounded-full bg-linear-to-r from-[#6C5CE7] to-[#8B7CF6] text-sm font-medium text-white shadow-md shadow-[#6C5CE7]/25 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#6C5CE7]/30 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 sm:h-11"
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
      </div>
    </form>
  );
}

