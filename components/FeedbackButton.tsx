import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function FeedbackButton() {
  return (
    <Link
      href="/feedback"
      aria-label="Feedback & Suggestions"
      title="Feedback & Suggestions"
      className="
        group fixed right-0 top-1/2 z-50
        flex h-12 -translate-y-1/2
        items-center
        rounded-l-xl border border-r-0
        bg-background shadow-md
        transition-all duration-200
        hover:bg-muted
      "
    >
      <div className="flex items-center px-3">
        <MessageSquare className="size-5 shrink-0" />

        <span
          className="
            ml-0 max-w-0 overflow-hidden whitespace-nowrap
            text-sm font-medium opacity-0
            transition-all duration-200
            group-hover:ml-2
            group-hover:max-w-45
            group-hover:opacity-100
          "
        >
          Feedback & Suggestions
        </span>
      </div>
    </Link>
  );
}
