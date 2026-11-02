import React, {isValidElement, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import OriginalSearchPage from '@theme-original/SearchPage';

/**
 * docusaurus-search-local's page is `<Layout><SearchPageContent /></Layout>`
 * and uses no hooks itself, so calling it as a plain function yields that
 * element; its child is the page content, which we re-seat in a <main>
 * landmark (Layout renders none). Null if the plugin's shape ever changes.
 */
function pluginSearchContent(): ReactNode | null {
  const page: unknown = (OriginalSearchPage as () => ReactNode)();
  return isValidElement<{children?: ReactNode}>(page) && page.type === Layout
    ? page.props.children
    : null;
}

/** Underlined: colour alone doesn't set a link apart from muted text. */
const HINT_LINK = 'font-medium underline underline-offset-4 hover:text-primary';

function BrowseHint(): ReactNode {
  return (
    <p className="!mt-10 !mb-0 text-sm text-muted-foreground">
      <Translate
        id="searchPage.browseHint"
        description="Hint under the search results; {blog} and {tutorials} are links"
        values={{
          blog: (
            <Link to="/blog" className={HINT_LINK}>
              <Translate id="searchPage.browseHint.blog" description="Link label in the search page hint">
                browse the blog
              </Translate>
            </Link>
          ),
          tutorials: (
            <Link to="/docs/intro" className={HINT_LINK}>
              <Translate id="searchPage.browseHint.tutorials" description="Link label in the search page hint">
                the tutorials
              </Translate>
            </Link>
          ),
        }}>
        {'Not finding it? Try other words, or {blog} and {tutorials}.'}
      </Translate>
    </p>
  );
}

/** The search page in the site container, inside a <main>, styled in custom.css via [data-search-page]. */
export default function SearchPage(): ReactNode {
  const content = pluginSearchContent();
  if (content === null) {
    return <OriginalSearchPage />;
  }
  return (
    <Layout>
      <main data-search-page="" className="mx-auto w-full max-w-[1200px] px-6 py-12">
        {content}
        <BrowseHint />
      </main>
    </Layout>
  );
}
