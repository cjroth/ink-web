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
      {
        text: 'Components',
        url: '/docs/components',
      },
    ],
    githubUrl: 'https://github.com/cjroth/ink-web',
  };
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      Open-source on{' '}
      <a href="https://github.com/cjroth/ink-web" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">GitHub</a>.
      {' '}Built by <a href="https://cjroth.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Chris Roth</a>.
    </footer>
  );
}
