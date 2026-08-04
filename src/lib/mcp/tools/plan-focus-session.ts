import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "plan_focus_session",
  title: "Plan a focus session",
  description:
    "Build a FlowZen Pomodoro plan for a block of available time: how many focus/break cycles fit, and the total focused minutes.",
  inputSchema: {
    available_minutes: z.number().int().min(5).max(600).describe("Total time available, in minutes."),
    focus_minutes: z.number().int().min(5).max(120).default(25).describe("Length of each focus session."),
    break_minutes: z.number().int().min(1).max(60).default(5).describe("Length of each break."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ available_minutes, focus_minutes, break_minutes }) => {
    const focus = focus_minutes ?? 25;
    const brk = break_minutes ?? 5;
    const cycle = focus + brk;

    let remaining = available_minutes;
    const schedule: { step: number; type: "focus" | "break"; minutes: number }[] = [];
    let step = 1;
    while (remaining >= focus) {
      schedule.push({ step: step++, type: "focus", minutes: focus });
      remaining -= focus;
      if (remaining >= brk) {
        schedule.push({ step: step++, type: "break", minutes: brk });
        remaining -= brk;
      } else break;
    }

    const cycles = schedule.filter((s) => s.type === "focus").length;
    const totalFocus = cycles * focus;
    const plan = {
      cycles,
      focus_minutes: focus,
      break_minutes: brk,
      total_focus_minutes: totalFocus,
      leftover_minutes: remaining,
      cycle_length_minutes: cycle,
      schedule,
    };

    const text = cycles
      ? `${cycles} focus session${cycles > 1 ? "s" : ""} of ${focus} min (${totalFocus} min focused), ${brk} min breaks between. ${remaining} min left over.`
      : `Not enough time for a full ${focus} min focus session.`;

    return { content: [{ type: "text", text }], structuredContent: plan };
  },
});
