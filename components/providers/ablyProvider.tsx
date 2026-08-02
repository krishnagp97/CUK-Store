"use client";

import { AblyProvider } from "ably/react";
import * as Ably from "ably";
import { ReactNode } from "react";

const client = new Ably.Realtime({
  authUrl: "/api/ably/token",
  autoConnect: true,
});

export default function Provider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AblyProvider client={client}>
      {children}
    </AblyProvider>
  );
}