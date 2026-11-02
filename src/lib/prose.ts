// Tailwind utilities live in a cascade layer while Infima's element rules
// (a, h1–h6, table) are unlayered, so overriding those needs `!`.
// Class names must stay literal for Tailwind's source scanner.
export const PROSE_CLASSES = [
  // The measure comes from the page column (one width for text, headings and code),
  // not per element — capping only some children leaves a ragged right edge
  'text-base leading-7',
  '[&_h1]:mt-2 [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight',
  '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight',
  '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium',
  '[&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-medium [&_h5]:mt-4 [&_h5]:mb-2 [&_h5]:text-sm [&_h5]:font-medium [&_h6]:mt-4 [&_h6]:mb-2 [&_h6]:text-sm [&_h6]:font-medium',
  // inline links in running text: --primary (≥4.5:1 in both themes) + underline, not hue alone
  '[&_p]:my-3 [&_a]:font-medium',
  '[&_:is(p,li,td,th,blockquote)_a:not(.hash-link)]:!text-primary [&_:is(p,li,td,th,blockquote)_a:not(.hash-link)]:!underline [&_:is(p,li,td,th,blockquote)_a:not(.hash-link)]:!decoration-primary/45 [&_:is(p,li,td,th,blockquote)_a:not(.hash-link)]:underline-offset-[3px] hover:[&_:is(p,li,td,th,blockquote)_a:not(.hash-link)]:!decoration-current',
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1',
  // GFM task lists: no bullet, read-only checkbox aligned with the text
  '[&_.contains-task-list]:list-none [&_.contains-task-list]:pl-1 [&_.task-list-item_input]:mr-2 [&_.task-list-item_input]:size-3.5 [&_.task-list-item_input]:translate-y-0.5 [&_.task-list-item_input]:cursor-default [&_.task-list-item_input]:accent-primary',
  // Infima paints <hr> mid-grey; match the header rule's token
  '[&_hr]:!my-8 [&_hr]:!bg-border',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
  '[&_img]:rounded-lg [&_img]:border [&_img]:border-border',
  '[&_code:not(pre code)]:rounded-sm [&_code:not(pre code)]:bg-muted [&_code:not(pre code)]:px-1 [&_code:not(pre code)]:py-0.5 [&_code:not(pre code)]:font-mono [&_code:not(pre code)]:text-[0.85em]',
  // no global border-color default, so bare `border` would fall back to currentColor
  // dark: the Prism block (#0e0d1c) is near the page tone, so a brighter rim
  // and a faint halo set it apart (bg stays — token colours are tuned to it)
  '[&_.theme-code-block]:rounded-lg [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border dark:[&_pre]:border-white/20 dark:[&_.theme-code-block]:shadow-[0_0_0_4px_oklch(1_0_0/0.04)]',
  '[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border-b [&_th]:border-border [&_th]:p-2 [&_th]:text-left [&_th]:font-medium [&_td]:border-b [&_td]:border-border [&_td]:p-2 [&_td]:align-top [&_td]:text-muted-foreground',
].join(' ');
