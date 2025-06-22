// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that detects system anomalies and provides user-friendly explanations.
 *
 * - analyzeSystemStatus - A function that analyzes the system status and provides anomaly detection.
 * - SystemStatusInput - The input type for the analyzeSystemStatus function.
 * - SystemStatusOutput - The return type for the analyzeSystemStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SystemStatusInputSchema = z.object({
  systemMetrics: z.string().describe('A JSON string containing system metrics data, including device status, energy consumption, and network activity.'),
});
export type SystemStatusInput = z.infer<typeof SystemStatusInputSchema>;

const SystemStatusOutputSchema = z.object({
  hasAnomalies: z.boolean().describe('Whether any anomalies were detected in the system status.'),
  anomalyExplanation: z.string().describe('A human-readable explanation of any detected anomalies and their potential impact.'),
  recommendations: z.string().describe('Recommendations for addressing the detected anomalies.'),
});
export type SystemStatusOutput = z.infer<typeof SystemStatusOutputSchema>;

export async function analyzeSystemStatus(input: SystemStatusInput): Promise<SystemStatusOutput> {
  return analyzeSystemStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'systemStatusAlertsPrompt',
  input: {schema: SystemStatusInputSchema},
  output: {schema: SystemStatusOutputSchema},
  prompt: `You are an AI-powered smart home system expert.

You are provided with system metrics data in JSON format. Analyze the data to proactively detect anomalies that could indicate potential issues.

Based on the data, determine if there are any anomalies, explain the anomalies in an easy-to-understand format, and provide recommendations for addressing them.

System Metrics Data:
{{{systemMetrics}}}

Respond with a JSON object.
`, 
});

const analyzeSystemStatusFlow = ai.defineFlow(
  {
    name: 'analyzeSystemStatusFlow',
    inputSchema: SystemStatusInputSchema,
    outputSchema: SystemStatusOutputSchema,
  },
  async input => {
    try {
      // Parse the JSON string to a plain Javascript object so that Handlebars can use it
      const systemMetrics = JSON.parse(input.systemMetrics);
      const {output} = await prompt({
        ...input,
        systemMetrics: JSON.stringify(systemMetrics)
      });
      return output!;
    } catch (e) {
      console.error('Error parsing system metrics:', e);
      return {
        hasAnomalies: true,
        anomalyExplanation: `Error parsing system metrics: ${e}`,
        recommendations: 'Check system logs for more information.',
      };
    }
  }
);
