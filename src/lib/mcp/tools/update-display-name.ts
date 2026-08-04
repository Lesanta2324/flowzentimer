import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_display_name",
  title: "Update my display name",
  description: "Set the display name on the signed-in FlowZen user's profile.",
  inputSchema: {
    display_name: z.string().trim().min(1).max(60).describe("New display name."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ display_name }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ user_id: userId, display_name }, { onConflict: "user_id" })
      .select("display_name")
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Display name set to "${data?.display_name ?? display_name}".` }],
      structuredContent: { display_name: data?.display_name ?? display_name },
    };
  },
});
