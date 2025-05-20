import { createClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const convexClient = createClient({
  url: process.env.NEXT_PUBLIC_CONVEX_URL,
});
