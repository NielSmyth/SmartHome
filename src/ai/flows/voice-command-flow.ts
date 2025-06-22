'use server';

/**
 * @fileOverview A flow that parses natural language commands into structured actions.
 *
 * - parseVoiceCommand - A function that handles the command parsing.
 * - VoiceCommandInput - The input type for the parseVoiceCommand function.
 * - VoiceCommandOutput - The return type for the parseVoiceCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceCommandInputSchema = z.object({
  command: z.string().describe('The voice command from the user.'),
  devices: z
    .array(z.string())
    .describe('A list of available device names.'),
  scenes: z.array(z.string()).describe('A list of available scene names.'),
  automations: z
    .array(z.string())
    .describe('A list of available automation names.'),
});
export type VoiceCommandInput = z.infer<typeof VoiceCommandInputSchema>;

const VoiceCommandOutputSchema = z.object({
  action: z
    .enum(['device', 'scene', 'automation', 'navigation', 'unknown'])
    .describe(
      "The type of action to perform. Use 'unknown' if the command cannot be understood."
    ),
  target: z
    .string()
    .describe(
      'The name of the device, scene, automation, or page to interact with.'
    ),
  value: z
    .any()
    .optional()
    .describe(
      'The state to set (e.g., true for on/active, false for off/paused).'
    ),
  speechResponse: z
    .string()
    .describe(
      'A natural language response to confirm the action or state why it failed.'
    ),
});
export type VoiceCommandOutput = z.infer<typeof VoiceCommandOutputSchema>;

export async function parseVoiceCommand(
  input: VoiceCommandInput
): Promise<VoiceCommandOutput> {
  return voiceCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceCommandParserPrompt',
  input: {schema: VoiceCommandInputSchema},
  output: {schema: VoiceCommandOutputSchema},
  prompt: `You are a smart home voice assistant. Your task is to parse the user's command and convert it into a structured JSON object.
Based on the command, determine the action ('device', 'scene', 'automation', or 'navigation'), the target, and any necessary value (e.g., true/false for on/off).
Also, provide a short, natural language response to confirm the action.

If the user's command is ambiguous or doesn't match any available items, set the action to 'unknown' and provide a helpful speech response like "Sorry, I couldn't find a device or scene with that name."

Analyze the sentiment of the command to determine the 'value'. For example, "turn on", "activate", "enable" should result in a value of true. "Turn off", "deactivate", "disable", "pause" should result in a value of false.

Available devices:
{{#each devices}}- {{{this}}}
{{/each}}

Available scenes:
{{#each scenes}}- {{{this}}}
{{/each}}

Available automations:
{{#each automations}}- {{{this}}}
{{/each}}

Available pages for navigation: Dashboard, Rooms, Scenes, Automations, Energy, System, Profile.

User command: "{{command}}"

Respond with a JSON object.
`,
});

const voiceCommandFlow = ai.defineFlow(
  {
    name: 'voiceCommandFlow',
    inputSchema: VoiceCommandInputSchema,
    outputSchema: VoiceCommandOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
