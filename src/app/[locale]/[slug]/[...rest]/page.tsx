import { notFound } from 'next/navigation';

/** Any deeper path under a chapter, such as /uk/lifecycle/extra, shows the localized 404. */
export default function DeeperPath() {
  notFound();
}
