import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'ink-web',
    },
    links: [
      {
        text: 'GitHub',
        url: 'https://github.com/yourusername/ink-web',
        external: true,
      },
    ],
  };
}
