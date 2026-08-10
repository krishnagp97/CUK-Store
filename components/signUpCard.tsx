"use client";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, User } from "lucide-react";

export default function SignUpCard() {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { name, email, password } = formData;
    const { data, error } = await signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.log(error);

      if (error.message?.toLowerCase().includes("user already exists")) {
        setErrorMessage("An account with this email already exists.");
      } else {
        setErrorMessage(error.message || "Something went wrong.");
      }

      return;
    }

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <Card className="w-full max-w-md rounded-2xl border-muted/60 shadow-xl">
      <CardHeader className="space-y-1.5 pb-2 text-center">
        <CardTitle className="text-2xl font-extrabold tracking-tight">
          Sign Up
        </CardTitle>
        <CardDescription>
          Create an account to start buying and selling
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="krishna"
                  required
                  className="rounded-xl pl-9"
                />
              </div>
            </div>
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
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="password123#"
                  required
                  minLength={8}
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
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
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-foreground hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}