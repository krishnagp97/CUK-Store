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

      router.push("/");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="hello@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="password123#"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {errorMessage && (
            <p className="w-full text-sm text-red-500">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </Button>
          <Button type="button" variant="outline" className="w-full">
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
