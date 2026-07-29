interface Props {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ChatPage({ params }: Props) {
  const { conversationId } = await params;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">
        Conversation: {conversationId}
      </h1>
    </div>
  );
}