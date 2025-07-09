
import { config } from 'dotenv';
config();

import '@/ai/flows/suggested-scenes.ts';
import '@/ai/flows/system-status-alerts.ts';
import '@/ai/flows/voice-command-flow.ts';
import '@/ai/flows/text-to-speech-flow.ts';
import '@/ai/flows/security-alert-flow.ts';
