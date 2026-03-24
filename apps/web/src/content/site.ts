export type RoleOption =
  | 'Terminal User'
  | 'Developer'
  | 'Founder'
  | 'Pixel Artist'
  | 'Designer'
  | 'Web3 Operator'
  | 'Protocol Builder'
  | 'Curious Human';

export type SpriteCard = {
  title: string;
  src: string;
  note: string;
  status: string;
};

export const roleOptions: RoleOption[] = [
  'Terminal User',
  'Developer',
  'Founder',
  'Pixel Artist',
  'Designer',
  'Web3 Operator',
  'Protocol Builder',
  'Curious Human',
];

export const currentSprites: SpriteCard[] = [
  {
    title: 'chibi cyborg',
    src: '/nqita-sprites/current/chibi-cyborg.gif',
    status: 'current shell',
    note: 'Closest to an everyday desktop companion that still feels technically sharp.',
  },
  {
    title: 'simple pink runner',
    src: '/nqita-sprites/current/simple-cyborg.gif',
    status: 'current shell',
    note: 'Small, readable, and ideal for persistent overlay behavior on dense screens.',
  },
  {
    title: 'cube core',
    src: '/nqita-sprites/current/cube-core.gif',
    status: 'current shell',
    note: 'Abstract daemon energy. Good for utility mode or network-state presence.',
  },
  {
    title: 'armored girl',
    src: '/nqita-sprites/current/armored-girl.gif',
    status: 'current shell',
    note: 'Heavier silhouette for a stronger operator persona and more overt identity.',
  },
];

export const plannedSprites: SpriteCard[] = [
  {
    title: 'full walk-cycle shell',
    src: '/nqita-sprites/planned/walk-cycle-south.png',
    status: 'planned body',
    note: 'Best route for wandering desktop motion, idles, and room-to-room embodiment.',
  },
  {
    title: 'computer-head form',
    src: '/nqita-sprites/planned/computer-head-south.png',
    status: 'planned body',
    note: 'Feels stranger and more post-human. Strong fit if identity leans deeper into agenthood.',
  },
  {
    title: 'monitor-body form',
    src: '/nqita-sprites/planned/monitor-body-south.png',
    status: 'planned body',
    note: 'Tighter link to terminal, dashboards, ledgers, and workstation-native presence.',
  },
  {
    title: 'soft chibi front',
    src: '/nqita-sprites/planned/chibi-south.png',
    status: 'planned body',
    note: 'The safest readable fallback if we need friendlier public-facing surfaces.',
  },
];

export const web3Signals = [
  {
    label: 'wallet-adjacent operator',
    detail:
      'Built for people living between terminal tabs, dashboards, wallets, contracts, and Discord war rooms.',
  },
  {
    label: 'byok and hosted path',
    detail:
      'Bring your own key for serious usage, or use the hosted path with limits while Nqita hardens.',
  },
  {
    label: 'persistent identity',
    detail: 'Not just another chat tab. The agent should stay present across surfaces and context boundaries.',
  },
];

export const stackRows = [
  'terminal command surface',
  'local daemon memory + state',
  'wallet / account-aware workflows later',
  'browser + desktop embodiment',
  'protocol and operator tooling over time',
];

export const tickerItems = [
  'daemon awake',
  'sprite candidates live',
  'pink network room online',
  'wallet-aware workflows planned',
  'desktop shell under construction',
  'byok path supported',
  'hosted path with limits',
  'identity still evolving',
];

export const osCompanionCards = [
  {
    title: 'local daemon first',
    detail:
      'Nqita should live as a background runtime with a local socket, state loop, and memory layer before any glossy UI shell.',
  },
  {
    title: 'context-aware with permission',
    detail:
      'She can notice terminal/editor/window context only when the user explicitly allows it, then offer actions instead of waiting for pasted prompts.',
  },
  {
    title: 'privacy by default',
    detail:
      'Everything stays local unless the user opts into hosted or plugin-based features. Memory belongs on disk, encrypted and inspectable.',
  },
];

export const buildLanes = [
  {
    title: 'artists + animators',
    detail: 'Sprites, idles, overlays, bubbles, motion language, and emotional range.',
  },
  {
    title: 'runtime + systems',
    detail: 'Daemon, permissions, sockets, local storage, platform bridges, and action safety.',
  },
  {
    title: 'plugin + web3',
    detail: 'Wallet/RPC helpers, contract explainers, attestations, and optional operator workflows.',
  },
];
