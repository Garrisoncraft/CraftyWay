import { syncUserCreation, syncUserUpdate } from "@/config/inngest";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserCreation
  ], 
});
