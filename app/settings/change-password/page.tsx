import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePasswordForm from "@/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div className="container mx-auto max-w-md py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>

        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}