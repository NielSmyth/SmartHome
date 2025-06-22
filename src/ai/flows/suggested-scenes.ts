// src/ai/flows/suggested-scenes.ts
'use server';

/**
 * @fileOverview A flow that suggests customized smart home scenarios based on the user's past actions.
 *
 * - suggestScenes - A function that suggests smart home scenarios.
 * - SuggestedScenesInput - The input type for the suggestScenes function.
 * - SuggestedScenesOutput - The return type for the suggestScenes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedScenesInputSchema = z.object({
  pastActions: z
    .array(z.string())
    .describe('An array of the user\'s past actions in the smart home.'),
});
export type SuggestedScenesInput = z.infer<typeof SuggestedScenesInputSchema>;

const SuggestedScenesOutputSchema = z.object({
  suggestedScenes: z
    .array(z.string())
    .describe('An array of suggested smart home scenarios based on past actions.'),
});
export type SuggestedScenesOutput = z.infer<typeof SuggestedScenesOutputSchema>;

export async function suggestScenes(input: SuggestedScenesInput): Promise<SuggestedScenesOutput> {
  return suggestScenesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestScenesPrompt',
  input: {schema: SuggestedScenesInputSchema},
  output: {schema: SuggestedScenesOutputSchema},
  prompt: `You are a smart home automation expert. Based on the user's past actions, suggest customized smart home scenarios.

Past Actions:
{{#each pastActions}}- {{{this}}}
{{/each}}

Suggest smart home scenarios that the user might find useful, based on their past actions. Be specific and provide actionable scene names.
`,
});

const suggestScenesFlow = ai.defineFlow(
  {
    name: 'suggestScenesFlow',
    inputSchema: SuggestedScenesInputSchema,
    outputSchema: SuggestedScenesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
