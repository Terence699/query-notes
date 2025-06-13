import { createOpenAI } from '@ai-sdk/openai';

// Check for required API keys
if (!process.env.SILICONFLOW_API_KEY && !process.env.DEEPSEEK_API_KEY) {
  throw new Error("At least one of SILICONFLOW_API_KEY or DEEPSEEK_API_KEY must be set in the environment variables");
}

// SiliconFlow provider (primary)
export const siliconflow = process.env.SILICONFLOW_API_KEY ? createOpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: "https://api.siliconflow.cn/v1",
}) : null;

// DeepSeek official provider (fallback)
export const deepseek = process.env.DEEPSEEK_API_KEY ? createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
}) : null;

// Provider configuration
export const AI_PROVIDERS = {
  siliconflow: {
    client: siliconflow,
    model: 'Pro/deepseek-ai/DeepSeek-V3',
    name: 'SiliconFlow'
  },
  deepseek: {
    client: deepseek,
    model: 'deepseek-chat',
    name: 'DeepSeek Official'
  }
} as const;

// Get the primary provider (SiliconFlow if available, otherwise DeepSeek)
export function getPrimaryProvider() {
  if (siliconflow) {
    return AI_PROVIDERS.siliconflow;
  }
  if (deepseek) {
    return AI_PROVIDERS.deepseek;
  }
  throw new Error("No AI provider is available. Please check your API keys.");
}

// Get the fallback provider (opposite of primary)
export function getFallbackProvider() {
  const primary = getPrimaryProvider();
  if (primary === AI_PROVIDERS.siliconflow && deepseek) {
    return AI_PROVIDERS.deepseek;
  }
  if (primary === AI_PROVIDERS.deepseek && siliconflow) {
    return AI_PROVIDERS.siliconflow;
  }
  return null; // No fallback available
}

// Smart provider with automatic failover
export async function createSmartProvider() {
  const primary = getPrimaryProvider();
  const fallback = getFallbackProvider();
  
  return {
    primary,
    fallback,
    // Helper method to get a model instance with failover
    getModel: (modelOverride?: string) => {
      const modelName = modelOverride || primary.model;
      return primary.client!(modelName);
    },
    // Helper method to get fallback model
    getFallbackModel: (modelOverride?: string) => {
      if (!fallback) return null;
      const modelName = modelOverride || fallback.model;
      return fallback.client!(modelName);
    }
  };
}

// Export the default provider for backward compatibility
export const defaultProvider = getPrimaryProvider().client!; 