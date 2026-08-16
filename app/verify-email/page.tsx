"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  async function resendVerification() {
    if (!email) {
      setMessage("Email not found");
      return;
    }

    if (cooldown > 0 || loading) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/",
      });

      if (error) {
        setMessage(error.message ?? "Failed to send verification email");
        return;
      }

      setMessage("Verification email sent. Please check your inbox.");
      setCooldown(60);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border p-8 text-center">
        <Mail className="mx-auto mb-4 h-12 w-12 text-blue-600" />

        <h1 className="text-2xl font-bold">Verify your email</h1>

        <p className="mt-3 text-muted-foreground">
          We've sent a verification link to:
        </p>

        <p className="mt-2 font-semibold">{email}</p>

        <p className="mt-3 text-sm text-muted-foreground">
          Please check your inbox and click the verification link before logging
          in.
        </p>

        <Button
          className="mt-6 w-full"
          onClick={resendVerification}
          disabled={loading || cooldown > 0}
        >
          {loading
            ? "Sending..."
            : cooldown > 0
              ? `Resend available in ${cooldown}s`
              : "Resend Verification Email"}
        </Button>

        {message && <p className="mt-4 text-sm">{message}</p>}

        <Button variant="link" asChild className="mt-3">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  );
}
