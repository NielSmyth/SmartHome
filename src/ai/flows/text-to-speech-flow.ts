'use server';
/**
 * @fileOverview A flow that converts text to speech using Google's TTS model.
 *
 * - textToSpeech - A function that handles the text-to-speech conversion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
      audioDataUri: z.string(),
    }),
  },
  async (text) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {voiceName: 'Algenib'},
            },
          },
        },
        prompt: text,
      });

      if (!media) {
        console.error('No audio media returned from TTS model.');
        return { audioDataUri: '' };
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      const wavBase64 = await toWav(audioBuffer);

      return {
        audioDataUri: `data:audio/wav;base64,${wavBase64}`,
      };
    } catch (error) {
        console.error("Error during text-to-speech generation:", error);
        return { audioDataUri: '' };
    }
  }
);

export async function textToSpeech(text: string): Promise<{ audioDataUri: string }> {
  return textToSpeechFlow(text);
}
