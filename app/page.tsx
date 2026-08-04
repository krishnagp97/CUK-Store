import HomePageComponent from "@/components/home/homePageComponent";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <HomePageComponent
      search={params.search ?? ""}
      category={params.category ?? ""}
    />
  );
}