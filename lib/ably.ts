import Ably from "ably";

export const ably = new Ably.Rest({
  key: process.env.ABLY_API_KEY,
});