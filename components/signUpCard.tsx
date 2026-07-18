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

export default function SignUpCard() {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const { name, email, password } = formData;
    const { data, error } = await signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.log(error);
      return;
    }
     
    setFormData({
      name:"",
      email:"",
      password:"",

    })

     router.push("/")
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up </CardTitle>
        <CardDescription>
          Create an account to Start buying and selling{" "}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="userName">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                type="name"
                placeholder="krishna"
                required
              />
            </div>
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
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="password123#"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-foreground hover:underline"
            >
              sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
