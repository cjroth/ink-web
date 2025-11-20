import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Ink Web',
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
      },
    ],
    githubUrl: 'https://github.com/cjroth/ink-web',
  };
}
