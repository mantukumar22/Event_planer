/**
 * @file lib/gemini-fallback.ts
 * @description Single responsibility: Resilient Gemini API caller with primary-to-fallback model chain,
 * AbortController timeout, and MOCK_AI environment flag support.
 */

import { ai } from './gemini';

export interface ModelCallOptions {
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  temperature?: number;
  timeoutMs?: number;
}

const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash';
const DEFAULT_TIMEOUT_MS = 25000;

export function isMockAiEnabled(): boolean {
  return process.env.MOCK_AI === 'true' || process.env.NEXT_PUBLIC_MOCK_AI === 'true';
}

/**
 * Calls Gemini with automatic fallback to secondary model and timeout safety.
 */
export async function callGeminiWithFallback(
  prompt: string,
  options: ModelCallOptions = {}
): Promise<string> {
  if (isMockAiEnabled()) {
    throw new Error('MOCK_AI_TRIGGERED');
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const tryModel = async (model: string): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
          responseSchema: options.responseSchema,
          temperature: options.temperature ?? 0.7,
        },
      });

      clearTimeout(timeoutId);

      const text = response.text;
      if (!text || text.trim().length === 0) {
        throw new Error(`Empty response from ${model}`);
      }
      return text;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError' || controller.signal.aborted) {
        throw new Error(`Model ${model} timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  };

  // 1. Try Primary Model
  try {
    return await tryModel(PRIMARY_MODEL);
  } catch (primaryErr: any) {
    console.warn(`Primary model (${PRIMARY_MODEL}) failed: ${primaryErr?.message}. Falling back to ${FALLBACK_MODEL}...`);

    // 2. Try Fallback Model
    try {
      return await tryModel(FALLBACK_MODEL);
    } catch (fallbackErr: any) {
      console.error(`Fallback model (${FALLBACK_MODEL}) also failed: ${fallbackErr?.message}`);
      throw fallbackErr;
    }
  }
}
