"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";

export default function SignInCard() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const { email, password } = formData;

      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Invalid email or password");
        return;
      }

      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md rounded-2xl border-muted/60 shadow-xl">
      <CardHeader className="space-y-1.5 pb-2 text-center">
        <CardTitle className="text-2xl font-extrabold tracking-tight">
          Sign In
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="hello@example.com"
                  required
                  className="rounded-xl pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="password123#"
                  required
                  className="rounded-xl pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {errorMessage && (
            <p className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="relative flex w-full items-center py-1">
            <div className="flex-1 border-t" />
            <span className="mx-3 text-xs uppercase text-muted-foreground">
              or
            </span>
            <div className="flex-1 border-t" />
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full rounded-xl"
          >
            Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-foreground hover:underline"
            >
              sign Up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}