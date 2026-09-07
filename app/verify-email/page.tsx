"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!token) return;
    const verificationToken = token;

    let cancelled = false;

    async function verifyEmail() {
      setLoading(true);
      setMessage("");

      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token: verificationToken,
            callbackURL: "/",
          },
        });

        if (cancelled) return;

        if (error) {
          console.error("Email verification failed:", error);
          setMessage(
            error.message || "This verification link is invalid or expired.",
          );
          return;
        }

        setVerified(true);

        // Give Better Auth/session state a moment to update.
        const { data: session } = await authClient.getSession();
        console.log("Session after verification:", session);

         if (cancelled) return;

        router.replace("/");
        router.refresh();
      } catch (error) {
        console.error("Email verification error:", error);

        if (!cancelled) {
          setMessage("Something went wrong while verifying your email.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

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

    if (cooldown > 0 || loading) return;

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

  // Verification is currently happening
  if (token && loading && !verified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin" />

          <h1 className="text-xl font-semibold">Verifying your email...</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we verify your account.
          </p>
        </div>
      </div>
    );
  }

  // Verification succeeded
  if (verified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-10 w-10 text-green-600" />

          <h1 className="text-xl font-semibold">
            Email verified successfully!
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Signing you in...
          </p>
        </div>
      </div>
    );
  }

  // Invalid/expired token
  if (token && message) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <XCircle className="mx-auto mb-4 h-10 w-10 text-red-600" />

          <h1 className="text-xl font-semibold">Verification failed</h1>

          <p className="mt-2 text-sm text-muted-foreground">{message}</p>

          <Button asChild className="mt-6">
            <Link href="/sign-in">Go to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Normal page after signup
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-xl">
        <Mail className="mx-auto mb-5 h-12 w-12 text-primary" />

        <h1 className="text-2xl font-bold">Check your email</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          We sent a verification link to
        </p>

        {email && <p className="mt-1 font-medium">{email}</p>}

        <p className="mt-4 text-sm text-muted-foreground">
          Click the link in the email to verify your account.
        </p>

        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}

        <Button
          onClick={resendVerification}
          disabled={cooldown > 0 || loading}
          className="mt-6 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            "Resend verification email"
          )}
        </Button>
      </div>
    </div>
  );
}
