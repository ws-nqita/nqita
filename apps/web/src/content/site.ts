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
    id: 'computer-head',
    src: '/nqita-sprites/candidates/computer-head.gif',
    alt: 'Potential Nqita sprite candidate 5',
  },
  {
    id: 'monitor-body',
    src: '/nqita-sprites/candidates/monitor-body.gif',
    alt: 'Potential Nqita sprite candidate 6',
  },
  {
    id: 'walk-cycle',
    src: '/nqita-sprites/candidates/walk-cycle.gif',
    alt: 'Potential Nqita sprite candidate 7',
  },
];

export const homepageFacts = [
  'Nqita is an open source desktop companion by WokSpec.',
  'Right now the working public prototype is the CLI and local daemon.',
  'The long goal is a character that can live on your desktop and react in a way that feels calm, useful, and human.',
];

export const buildPlan = [
  'Keep it local.',
  'Make it clear what it is doing.',
  'Make the art and motion feel right.',
];

export const documentationLinks: DocLink[] = [
  {
    title: 'Main GitHub org',
    href: 'https://github.com/ws-nqita',
    description: 'Start here for the main project and public repos.',
  },
  {
    title: 'nqita-cli repo',
    href: 'https://github.com/ws-nqita/nqita-cli',
    description: 'This is the runnable public prototype today.',
  },
  {
    title: 'Sprite system doc',
    href: 'https://github.com/ws-nqita/nqita/blob/main/docs/SPRITE_SYSTEM.md',
    description: 'Best starting point if you want to help with art and animation.',
  },
];
