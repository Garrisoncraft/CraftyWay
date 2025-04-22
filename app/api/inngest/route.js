import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ], 
});
