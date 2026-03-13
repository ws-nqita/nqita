import { z } from 'zod';
import type { EralUser, IntegrationContext, IntegrationMetadataValue, KnownProduct } from '../types';

export const KNOWN_PRODUCTS = [
  'woksite',
  'wokgen',
  'wokpost',
  'chopsticks',
  'extension',
  'dilu',
  'vecto',
  'woktool',
  'wokid',
  'wokpay',
  'wokcloud',
  'wokbase',
  'wokflow',
  'wokplay',
  'wokspec',
] as const;

export const ProductSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9._-]*$/i, 'Product names must be simple identifiers')
  .optional();

const IntegrationMetadataValueSchema = z.union([
  z.string().trim().min(1).max(500),
  z.number().finite(),
  z.boolean(),
]);

export const IntegrationSchema = z
  .object({
    id: z.string().trim().min(1).max(80).optional(),
    name: z.string().trim().min(1).max(120).optional(),
    kind: z.string().trim().min(1).max(40).optional(),
    url: z.string().url().max(500).optional(),
    origin: z.string().url().max(200).optional(),
    pageTitle: z.string().trim().min(1).max(200).optional(),
    locale: z.string().trim().min(1).max(32).optional(),
    userRole: z.string().trim().min(1).max(80).optional(),
    instructions: z.string().trim().min(1).max(2000).optional(),
    capabilities: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
    metadata: z.record(z.string().trim().min(1).max(60), IntegrationMetadataValueSchema).optional(),
  })
  .strict()
  .optional();

const PRODUCT_DESCRIPTIONS: Record<KnownProduct, string> = {
  woksite: 'WokSite — The central WokSpec ecosystem hub for bookings, SSO, and community.',
  wokgen: 'WokGen — AI-powered asset generation for pixel art, images, and creative media.',
  wokpost: 'WokPost — Workflow-centric social media platform designed for builders and developers.',
  chopsticks: 'Chopsticks — Discord integration and community management dashboard for WokSpec.',
  extension: 'WokSpec Extension — Browser-level AI integration for web interaction and productivity.',
  dilu: 'Dilu — Production-ready template launchpad for rapid software deployment.',
  vecto: 'Vecto — AI-driven brand studio and visual identity design platform.',
  woktool: 'WokTool — Professional browser-based utility suite for developer productivity.',
  wokid: 'WokID — Unified identity, authentication, and security layer for WokSpec.',
  wokpay: 'WokPay — Integrated payment processing, billing, and subscription management.',
  wokcloud: 'WokCloud — High-performance cloud infrastructure and hosting services.',
  wokbase: 'WokBase — Managed database and real-time storage solutions for WokSpec apps.',
  wokflow: 'WokFlow — Automation and workflow orchestration engine for builders.',
  wokplay: 'WokPlay — Community gaming, interactive experiences, and social entertainment.',
  wokspec: 'WokSpec — The core ecosystem providing tools and services for the next generation of builders.',
};

function isKnownProduct(product?: string | null): product is KnownProduct {
  return Boolean(product && (KNOWN_PRODUCTS as readonly string[]).includes(product));
}

function describeProduct(product: string): string {
  return isKnownProduct(product) ? PRODUCT_DESCRIPTIONS[product] : product;
}

function formatMetadataValue(value: IntegrationMetadataValue): string {
  return typeof value === 'string' ? value : String(value);
}

function describeIntegration(integration: IntegrationContext): string[] {
  const lines: string[] = [];
  if (integration.name) lines.push(`Integration name: ${integration.name}`);
  if (integration.kind) lines.push(`Integration kind: ${integration.kind}`);
  if (integration.url) lines.push(`Current URL: ${integration.url}`);
  if (integration.origin) lines.push(`Origin: ${integration.origin}`);
  if (integration.pageTitle) lines.push(`Page title: ${integration.pageTitle}`);
  if (integration.locale) lines.push(`Locale: ${integration.locale}`);
  if (integration.userRole) lines.push(`User role: ${integration.userRole}`);
  if (integration.capabilities?.length) {
    lines.push(`Integration capabilities: ${integration.capabilities.join(', ')}`);
  }
  if (integration.instructions) {
    lines.push(`Integration instructions: ${integration.instructions}`);
  }
  if (integration.metadata) {
    const entries = Object.entries(integration.metadata)
      .slice(0, 12)
      .map(([key, value]) => `${key}: ${formatMetadataValue(value)}`);
    if (entries.length > 0) {
      lines.push(`Integration metadata:\n${entries.join('\n')}`);
    }
  }
  return lines;
}

/**
 * Build an enriched context string that gives Eral knowledge about the
 * current user and any page/product context provided by the client.
 */
export function buildContext(options: {
  user: EralUser;
  pageContext?: string;
  product?: string;
  integration?: IntegrationContext;
}): string {
  const lines: string[] = [];
  const userSummary = options.user.email
    ? `${options.user.displayName} (${options.user.email})`
    : options.user.displayName;
  lines.push(`Current user: ${userSummary}`);

  if (options.product) {
    lines.push(`Product context: ${describeProduct(options.product)}`);
  }

  if (options.integration) {
    const integrationLines = describeIntegration(options.integration);
    if (integrationLines.length > 0) {
      lines.push('', 'Integration context:');
      lines.push(...integrationLines);
    }
  }

  if (options.pageContext) {
    lines.push(`\nPage content provided by user:\n${options.pageContext}`);
  }

  return lines.join('\n');
}

/** Product-specific system prompt extras by source product. */
export function productPromptExtras(
  product?: string,
  integration?: IntegrationContext
): string {
  const extras: string[] = [];

  switch (isKnownProduct(product) ? product : undefined) {
    case 'wokgen':
      extras.push('When discussing asset generation, you can suggest pixel art styles, color palettes, and ComfyUI workflow tips.');
      break;
    case 'wokpost':
      extras.push('When helping with posts, optimize for developer and builder audiences. Suggest relevant hashtags and formatting.');
      break;
    case 'chopsticks':
      extras.push('You have knowledge of Discord bot commands, economy systems, and community management within WokSpec.');
      break;
    case 'extension':
      extras.push('You are running in the WokSpec browser extension. Help users understand and interact with the current web page.');
      break;
    case 'dilu':
      extras.push('Help users choose templates, understand launch workflows, and connect Dilu to the wider WokSpec stack.');
      break;
    case 'vecto':
      extras.push('When helping in Vecto, focus on brand systems, visual direction, asset generation workflows, and creative execution.');
      break;
    case 'woktool':
      extras.push('When helping in WokTool, guide users to the right browser-based utilities and keep answers practical and fast.');
      break;
    case 'wokid':
      extras.push('Provide guidance on identity management, SSO integration, and security best practices within the WokSpec ecosystem.');
      break;
    case 'wokpay':
      extras.push('Assist with billing, subscription management, and payment processing queries using WokPay.');
      break;
    case 'wokcloud':
      extras.push('Guide users through cloud infrastructure setup, deployment strategies, and performance optimization.');
      break;
    case 'wokbase':
      extras.push('Provide expertise on data modeling, storage optimization, and real-time database management.');
      break;
    case 'wokflow':
      extras.push('Help users build and optimize automated workflows and process orchestrations.');
      break;
    case 'wokplay':
      extras.push('Engage users with community gaming features and social interaction tools.');
      break;
    case 'wokspec':
      extras.push('Provide general assistance across the entire WokSpec ecosystem, serving as a primary point of contact for help and support.');
      break;
    default:
      break;
  }

  if (integration?.kind) {
    extras.push(`You are embedded inside a ${integration.kind} integration. Respect that environment's constraints and help the user complete work there.`);
  }
  if (integration?.capabilities?.length) {
    extras.push(`Available integration capabilities: ${integration.capabilities.join(', ')}.`);
  }
  if (integration?.userRole) {
    extras.push(`Tailor your response to a user whose role is: ${integration.userRole}.`);
  }
  if (integration?.instructions) {
    extras.push(`Follow these integration-specific instructions: ${integration.instructions}`);
  }

  return extras.join('\n');
}
