import SignUpCard from "@/components/signUpCard";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SignUp() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <SignUpCard />
    </div>
  );
}
