export default function FeedbackPage() {
  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Feedback & Support</h1>

          <p className="mt-2 text-muted-foreground">
            Help us make Campus Marketplace better.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScD0fIREBTnK1FRVhcjbVPEcir7wsXXinXjJet6kuoi6nd4Ag/viewform?embedded=true"
            className="h-310.25 w-full border-0"
            title="Campus Marketplace Feedback & Support"
          >
            Loading…
          </iframe>
        </div>
      </section>
    </main>
  );
}
