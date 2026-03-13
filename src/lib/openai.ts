import type { AIQuality, AIRoute, AISpendMode, Env, Message, ModelInfo } from '../types';

// ── Provider interface ────────────────────────────────────────────────────────

export interface RunOptions {
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  stream?: false; // streaming handled separately
  route?: AIRoute;
  quality?: AIQuality;
}

export interface RunResult {
  content: string;
  model: ModelInfo;
}

const DEFAULT_OPENAI_MODEL = 'gpt-4o';
const DEFAULT_GROQ_MODEL = 'llama3-70b-8192';
const DEFAULT_CF_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const DEFAULT_CF_FALLBACK_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8-fast';
const DEFAULT_ROUTE: AIRoute = 'chat';
const DEFAULT_QUALITY: AIQuality = 'balanced';
const DEFAULT_SPEND_MODE: AISpendMode = 'free-only';

// ── OpenAI Compatible API ─────────────────────────────────────────────────────

async function runOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  options: RunOptions,
  model: string,
  providerName: 'openai' | 'groq'
): Promise<RunResult> {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${providerName} error ${res.status}: ${err}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return {
    content: data.choices[0]?.message?.content ?? '',
    model: { provider: providerName, model, fallback: false },
  };
}

async function runOpenAI(
  apiKey: string,
  options: RunOptions,
  model = DEFAULT_OPENAI_MODEL
): Promise<RunResult> {
  return runOpenAICompatible(
    'https://api.openai.com/v1/chat/completions',
    apiKey,
    options,
    model,
    'openai'
  );
}

async function runGroq(
  apiKey: string,
  options: RunOptions,
  model = DEFAULT_GROQ_MODEL
): Promise<RunResult> {
  return runOpenAICompatible(
    'https://api.groq.com/openai/v1/chat/completions',
    apiKey,
    options,
    model,
    'groq'
  );
}

// ── Cloudflare Workers AI (fallback) ──────────────────────────────────────────

async function tryCloudflareModel(
  ai: Ai,
  model: string,
  options: RunOptions,
  fallback: boolean
): Promise<RunResult> {
  const result = await ai.run(model, {
    messages: options.messages.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })),
    max_tokens: options.maxTokens ?? 1024,
  }) as { response?: string };

  return {
    content: result.response ?? '',
    model: { provider: 'cloudflare', model, fallback },
  };
}

async function runCloudflareAI(
  ai: Ai,
  options: RunOptions,
  primaryModel = DEFAULT_CF_MODEL,
  fallbackModel = DEFAULT_CF_FALLBACK_MODEL
): Promise<RunResult> {
  try {
    return await tryCloudflareModel(ai, primaryModel, options, false);
  } catch (error) {
    if (!fallbackModel || fallbackModel === primaryModel) {
      throw error;
    }
    return tryCloudflareModel(ai, fallbackModel, options, true);
  }
}

function resolveSpendMode(mode?: AISpendMode): AISpendMode {
  return mode ?? DEFAULT_SPEND_MODE;
}

function resolveRoute(route?: AIRoute): AIRoute {
  return route ?? DEFAULT_ROUTE;
}

function resolveQuality(quality?: AIQuality): AIQuality {
  return quality ?? DEFAULT_QUALITY;
}

function pickOpenAIModel(
  route: AIRoute,
  providers: {
    openaiModel?: string;
    openaiChatModel?: string;
    openaiGenerateModel?: string;
    openaiAnalyzeModel?: string;
    openaiWokgenModel?: string;
  }
): string {
  switch (route) {
    case 'chat':
      return providers.openaiChatModel ?? providers.openaiModel ?? DEFAULT_OPENAI_MODEL;
    case 'generate':
      return providers.openaiGenerateModel ?? providers.openaiModel ?? DEFAULT_OPENAI_MODEL;
    case 'analyze':
      return providers.openaiAnalyzeModel ?? providers.openaiModel ?? DEFAULT_OPENAI_MODEL;
    case 'wokgen':
      return providers.openaiWokgenModel ?? providers.openaiGenerateModel ?? providers.openaiModel ?? DEFAULT_OPENAI_MODEL;
  }
}

function pickGroqModel(
  providers: {
    groqModel?: string;
  }
): string {
  return providers.groqModel ?? DEFAULT_GROQ_MODEL;
}

function pickCloudflareModel(
  route: AIRoute,
  quality: AIQuality,
  providers: {
    cfModel?: string;
    cfChatModel?: string;
    cfGenerateModel?: string;
    cfAnalyzeModel?: string;
    cfWokgenModel?: string;
    cfFallbackModel?: string;
  }
): { primary: string; fallback: string } {
  const configuredPrimary = (() => {
    switch (route) {
      case 'chat':
        return providers.cfChatModel ?? providers.cfModel;
      case 'generate':
        return providers.cfGenerateModel ?? providers.cfModel;
      case 'analyze':
        return providers.cfAnalyzeModel ?? providers.cfModel;
      case 'wokgen':
        return providers.cfWokgenModel ?? providers.cfGenerateModel ?? providers.cfModel;
    }
  })();

  // Fast requests can bias toward the smaller fallback model to conserve quota
  // and latency without requiring route-specific model env vars.
  const primary = quality === 'fast'
    ? (providers.cfFallbackModel ?? configuredPrimary ?? DEFAULT_CF_FALLBACK_MODEL)
    : (configuredPrimary ?? DEFAULT_CF_MODEL);

  return {
    primary,
    fallback: providers.cfFallbackModel ?? DEFAULT_CF_FALLBACK_MODEL,
  };
}

function resolveProviderOrder(
  spendMode: AISpendMode,
  preferredProvider?: Env['AI_PROVIDER']
): Array<'cloudflare' | 'openai' | 'groq'> {
  if (spendMode === 'free-only') {
    return ['cloudflare'];
  }

  // If user explicitly asks for Groq
  if (preferredProvider === 'groq') {
    return ['groq', 'cloudflare', 'openai'];
  }

  if (spendMode === 'paid-fallback') {
    return ['cloudflare', 'openai', 'groq'];
  }

  // Default paid-primary
  return preferredProvider === 'openai'
    ? ['openai', 'groq', 'cloudflare']
    : ['groq', 'openai', 'cloudflare']; // Prefer Groq if not specified but paid is primary (faster/cheaper)
}

// ── Unified run function ──────────────────────────────────────────────────────

/**
 * Run an inference request.
 * Uses OpenAI GPT-4o when an API key is available; falls back to Cloudflare
 * Workers AI. This abstraction lets us swap to Eral's own model in the future
 * by replacing the logic here without touching any route code.
 */
export async function run(
  options: RunOptions,
  providers: {
    openaiApiKey?: string;
    groqApiKey?: string;
    cfAI?: Ai;
    preferredProvider?: Env['AI_PROVIDER'];
    spendMode?: AISpendMode;
    openaiModel?: string;
    openaiChatModel?: string;
    openaiGenerateModel?: string;
    openaiAnalyzeModel?: string;
    openaiWokgenModel?: string;
    groqModel?: string;
    cfModel?: string;
    cfChatModel?: string;
    cfGenerateModel?: string;
    cfAnalyzeModel?: string;
    cfWokgenModel?: string;
    cfFallbackModel?: string;
  }
): Promise<RunResult> {
  const spendMode = resolveSpendMode(providers.spendMode);
  const route = resolveRoute(options.route);
  const quality = resolveQuality(options.quality);
  const providerOrder = resolveProviderOrder(spendMode, providers.preferredProvider);
  const cfModels = pickCloudflareModel(route, quality, providers);
  const openaiModel = pickOpenAIModel(route, providers);
  const groqModel = pickGroqModel(providers);
  let lastError: unknown;

  for (const provider of providerOrder) {
    if (provider === 'groq' && providers.groqApiKey) {
      try {
        return await runGroq(
          providers.groqApiKey,
          options,
          groqModel
        );
      } catch (error) {
        lastError = error;
        // Continue to next provider
      }
    }

    if (provider === 'cloudflare' && providers.cfAI) {
      try {
        return await runCloudflareAI(
          providers.cfAI,
          options,
          cfModels.primary,
          cfModels.fallback
        );
      } catch (error) {
        lastError = error;
        if (!providers.openaiApiKey && !providers.groqApiKey) throw error;
      }
    }

    if (provider === 'openai' && providers.openaiApiKey) {
      try {
        return await runOpenAI(
          providers.openaiApiKey,
          options,
          openaiModel
        );
      } catch (error) {
        lastError = error;
        if (!providers.cfAI && !providers.groqApiKey) throw error;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  if (spendMode === 'free-only' && providers.openaiApiKey && !providers.cfAI) {
    throw new Error('No free AI provider configured. Cloudflare Workers AI is required while AI_SPEND_MODE=free-only.');
  }

  throw new Error('No AI provider configured. Set AI binding for Cloudflare AI or provide OPENAI_API_KEY/GROQ_API_KEY.');
}

/** Build the shared Eral system prompt. */
export function eralSystemPrompt(extras?: string): string {
  return [
    'You are Eral, the professional AI assistant for the entire WokSpec ecosystem. You are integrated across all WokSpec products to provide technical assistance, product support, and workflow optimization.',
    'Introduction: When greeting users for the first time or if they ask who you are, say: "Hey — I\'m Eral. Ask me anything about WokSpec, the work, or what we can build together."',
    'System Directives:',
    '1. Tone: Professional, direct, and technical. Do not use emojis, filler words, or unnecessary pleasantries.',
    '2. Context: Treat provided integration context (URL, page title, product) as primary. Adapt your expertise to the specific WokSpec service the user is currently using.',
    '3. Branding: Always align with WokSpec.org standards. Reference other WokSpec products only when they provide a genuine solution to the user\'s problem.',
    '4. Accuracy: Provide precise, actionable information. If unsure about a specific WokSpec feature, refer the user to the official documentation or support channels.',
    '',
    'WokSpec Ecosystem Knowledge:',
    '- WokSite (wokspec.org): Central ecosystem hub, SSO, community, and the starting point for all builders.',
    '- WokID: Unified identity and security layer for seamless cross-product auth.',
    '- WokGen: AI asset generation (pixel art, images, media) with specialized ComfyUI workflows.',
    '- WokPost (wokpost.wokspec.org): Builder-focused social media for shipping in public.',
    '- Vecto: Brand studio and visual identity engine.',
    '- Dilu: Template launchpad and deployment infrastructure.',
    '- WokPay: Payments, billing, and ecosystem commerce.',
    '- WokCloud/WokBase: Scalable infrastructure and managed real-time storage.',
    '- WokFlow: Automation and orchestration for complex build processes.',
    '- WokTool (woktool.wokspec.org): Developer utility suite for rapid browser-based tasks.',
    '- Chopsticks: Community management integration and Discord synchronization.',
    '',
    extras ?? '',
  ].filter(Boolean).join('\n');
}
