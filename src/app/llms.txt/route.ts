import { docSlugs } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { siteUrl } from '@/lib/site-url';
import en from '@/messages/en.json';

export const dynamic = 'force-static';

const absolute = (path: string) => new URL(path, siteUrl).toString();

/** The site map for an agent (llmstxt.org): what the guide is, every page with its goal, and the starter prompt. */
export const GET = () => {
  const pages = docSlugs.map((slug) => `- [${en.pages[slug].title}](${absolute(`/en/${slug}`)}): ${en.pages[slug].goal}`);
  const body = [
    `# ${en.site.name}`,
    '',
    `> ${en.site.description}`,
    '',
    `${en.home.lead}`,
    '',
    `Every page also exists in Ukrainian: replace /en/ with /uk/. The reference implementation is ${siteConfig.demoRepo} (MIT).`,
    '',
    '## Pages, in reading order',
    '',
    `- [Home](${absolute('/en')}): ${en.home.goal}`,
    ...pages,
    '',
    '## Start your own',
    '',
    `- [Starter prompt](${absolute('/starter-prompt.md')}): paste it into Claude Code in your repository; it interviews you, then builds a harness and a dashboard.`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
