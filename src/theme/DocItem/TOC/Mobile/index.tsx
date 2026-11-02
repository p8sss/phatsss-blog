import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import { htmlToText } from "@/lib/html-text";

export default function DocItemTOCMobile(): ReactNode {
  const {toc} = useDoc();
  return (
    <div className="mb-6 min-[1200px]:hidden">
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {toc.map((item) => (
          <Link
            key={item.id}
            to={`#${item.id}`}
            data-noBrokenLinkCheck
            className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
            {htmlToText(item.value)}
          </Link>
        ))}
      </div>
    </div>
  );
}
