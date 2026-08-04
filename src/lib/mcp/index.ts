import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import updateDisplayNameTool from "./tools/update-display-name";
import suggestBreakActivityTool from "./tools/suggest-break-activity";
import planFocusSessionTool from "./tools/plan-focus-session";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "flowzen",
  title: "FlowZen",
  version: "0.1.0",
  instructions:
    "Tools for FlowZen, a mindful Pomodoro focus app. Use `get_profile` and `update_display_name` for the signed-in user's profile, `plan_focus_session` to lay out focus/break cycles for a block of time, and `suggest_break_activity` for mindful break ideas.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfileTool, updateDisplayNameTool, planFocusSessionTool, suggestBreakActivityTool],
});
