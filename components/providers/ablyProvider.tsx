"use client";

import { AblyProvider } from "ably/react";
import * as Ably from "ably";
import { ReactNode, useEffect, useState } from "react";

export default function Provider({
  children,
}: {
  children: ReactNode;
}) {
  const [client, setClient] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    const ablyClient = new Ably.Realtime({
      authUrl: "/api/ably/token",
      autoConnect: true,
    });

    setClient(ablyClient);

    return () => {
      ablyClient.close();
    };
  }, []);

  if (!client) {
    return null;
  }

  return <AblyProvider client={client}>{children}</AblyProvider>;
}