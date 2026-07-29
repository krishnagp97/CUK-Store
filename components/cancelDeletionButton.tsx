"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function CancelDeletionButton() {
  const router = useRouter();

  const handleCancel = async () => {
    try {
      const res = await fetch("/api/account/cancel-delete-request", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      // Refresh the page so the banner disappears
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Button variant="secondary" onClick={handleCancel}>
      Cancel Deletion Request
    </Button>
  );
}