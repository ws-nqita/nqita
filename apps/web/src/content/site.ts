export type SpriteOption = {
  id: string;
  src: string;
  alt: string;
};

export type DocLink = {
  title: string;
  href: string;
  description: string;
};

export const spriteOptions: SpriteOption[] = [
  {
    id: 'chibi-cyborg',
    src: '/nqita-sprites/candidates/chibi-cyborg.gif',
    alt: 'Potential Nqita sprite candidate 1',
  },
  {
    id: 'simple-cyborg',
    src: '/nqita-sprites/candidates/simple-cyborg.gif',
    alt: 'Potential Nqita sprite candidate 2',
  },
  {
    id: 'cube-core',
    src: '/nqita-sprites/candidates/cube-core.gif',
    alt: 'Potential Nqita sprite candidate 3',
  },
  {
    id: 'armored-girl',
    src: '/nqita-sprites/candidates/armored-girl.gif',
    alt: 'Potential Nqita sprite candidate 4',
  },
  {
    id: 'chibi-rotator',
    src: '/nqita-sprites/candidates/chibi-rotator.gif',
    alt: 'Potential Nqita sprite candidate 5',
  },
  {
    id: 'computer-head',
    src: '/nqita-sprites/candidates/computer-head.gif',
    alt: 'Potential Nqita sprite candidate 6',
  },
  {
    id: 'monitor-body',
    src: '/nqita-sprites/candidates/monitor-body.gif',
    alt: 'Potential Nqita sprite candidate 7',
  },
  {
    id: 'walk-cycle',
    src: '/nqita-sprites/candidates/walk-cycle.gif',
    alt: 'Potential Nqita sprite candidate 8',
  },
];

export const homepageFacts = [
  'Nqita is being built as a local desktop companion by WokSpec, not a chatbot trapped in a browser tab.',
  'The current public prototype is the CLI stack: a local daemon, terminal chat flow, and a sprite watcher that follows runtime state.',
  'The long-term goal is a Windows-first overlay that can stay visible on your desktop, react carefully, and show what it is doing.',
];

export const buildPlan = [
  'A local daemon owns chat, memory, permissions, and state.',
  'A desktop overlay renders the pixel character without blocking your work.',
  'The visible sprite, bubble, and logs should match the same runtime state instead of drifting apart.',
];

export const documentationLinks: DocLink[] = [
  {
    title: 'Nqita v1 index',
    href: 'https://github.com/ws-nqita/nqita/blob/main/docs/NQITA_V1_INDEX.md',
    description: 'Start here for the plain order of the core docs and the scope of version one.',
  },
  {
    title: 'Architecture v1',
    href: 'https://github.com/ws-nqita/nqita/blob/main/docs/ARCHITECTURE_V1.md',
    description: 'See how the daemon, overlay, memory, and renderer are meant to fit together.',
  },
  {
    title: 'Sprite system',
    href: 'https://github.com/ws-nqita/nqita/blob/main/docs/SPRITE_SYSTEM.md',
    description: 'Read the sprite format, rendering rules, and asset requirements for artists and implementers.',
  },
  {
    title: 'Agent runtime',
    href: 'https://github.com/ws-nqita/nqita/blob/main/docs/AGENT_RUNTIME.md',
    description: 'Read how the runtime is supervised, how it communicates, and how it recovers.',
  },
  {
    title: 'Roadmap',
    href: 'https://github.com/ws-nqita/nqita/blob/main/docs/ROADMAP.md',
    description: 'See what is planned next without losing the current architecture contract.',
  },
  {
    title: 'nqita-cli README',
    href: 'https://github.com/ws-nqita/nqita-cli',
    description: 'Use the live CLI prototype to understand what already runs today.',
  },
];
