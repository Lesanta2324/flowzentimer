import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const MINDFUL_ACTIVITIES = [
  "Take 5 slow deep breaths. Inhale for 4 seconds, hold for 4, exhale for 4.",
  "Stretch your shoulders and neck gently. Roll your head in slow circles.",
  "Stand up and walk around for 30 seconds. Feel the ground beneath your feet.",
  "Drink some water. Hydration helps your brain stay sharp.",
  "Look away from the screen for 20 seconds. Focus on something far away.",
  "Close your eyes and listen to the sounds around you for 15 seconds.",
  "Do 5 gentle wrist and finger stretches to prevent tension.",
  "Take a moment to notice 3 things you're grateful for right now.",
  "Stand up and do 5 slow squats to get your blood flowing.",
  "Place your hands on your belly and take 3 deep belly breaths.",
];

export default defineTool({
  name: "suggest_break_activity",
  title: "Suggest a mindful break activity",
  description:
    "Suggest one or more short mindful break activities from FlowZen's library, for use between focus sessions.",
  inputSchema: {
    count: z
      .number()
      .int()
      .min(1)
      .max(5)
      .default(1)
      .describe("How many distinct activities to suggest (1-5)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: ({ count }) => {
    const n = Math.min(Math.max(count ?? 1, 1), 5);
    const pool = [...MINDFUL_ACTIVITIES].sort(() => Math.random() - 0.5).slice(0, n);
    return {
      content: [{ type: "text", text: pool.map((a, i) => `${i + 1}. ${a}`).join("\n") }],
      structuredContent: { activities: pool },
    };
  },
});
