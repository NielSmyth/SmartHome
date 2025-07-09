
'use server';
/**
 * @fileOverview An AI agent that processes security events and generates user-friendly alerts.
 *
 * - processSecurityEvent - A function that analyzes a security event and provides a response.
 * - SecurityEventInput - The input type for the processSecurityEvent function.
 * - SecurityEventOutput - The return type for the processSecurityEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SecurityEventInputSchema = z.object({
  eventType: z.enum(['smoke', 'intrusion', 'gas_leak']).describe('The type of security event.'),
  location: z.string().describe('The location where the event was detected (e.g., "Kitchen").'),
});
export type SecurityEventInput = z.infer<typeof SecurityEventInputSchema>;

const SecurityEventOutputSchema = z.object({
  alertTitle: z.string().describe('A short, urgent title for the alert (e.g., "Smoke Detected!").'),
  alertDescription: z.string().describe('A human-readable explanation of the event and its location.'),
  recommendations: z.array(z.string()).describe('A list of recommended immediate actions for the user.'),
  speechResponse: z.string().describe('A calm, clear voice message to announce the alert.'),
});
export type SecurityEventOutput = z.infer<typeof SecurityEventOutputSchema>;

export async function processSecurityEvent(input: SecurityEventInput): Promise<SecurityEventOutput> {
  return securityAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'securityAlertPrompt',
  input: {schema: SecurityEventInputSchema},
  output: {schema: SecurityEventOutputSchema},
  prompt: `You are a home security AI assistant. Your primary function is to alert users to critical security events in a clear, calm, and actionable manner.

A security event has been detected.
Event Type: {{{eventType}}}
Location: {{{location}}}

Generate a response in JSON format with the following fields:
- alertTitle: A short, urgent title for the alert.
- alertDescription: A clear, concise description of what happened and where.
- recommendations: A list of 2-3 immediate, simple actions the user should take.
- speechResponse: A voice message to announce the event. Start with "Alert:" and speak calmly and clearly.

Example for a smoke event in the kitchen:
- alertTitle: "Smoke Detected in Kitchen!"
- alertDescription: "The smart smoke detector in the Kitchen has been triggered."
- recommendations: ["Evacuate the area immediately.", "Check for signs of fire from a safe distance.", "Contact emergency services if necessary."]
- speechResponse: "Alert: Smoke has been detected in the kitchen. Please evacuate and check for signs of fire."
`,
});

const securityAlertFlow = ai.defineFlow(
  {
    name: 'securityAlertFlow',
    inputSchema: SecurityEventInputSchema,
    outputSchema: SecurityEventOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
