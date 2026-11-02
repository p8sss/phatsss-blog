import type {ComponentProps, ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';

/**
 * MDX `input` override: GFM task-list checkboxes (`- [ ]`) are rendered
 * disabled with no label, which axe flags. Name them by their state so the
 * item reads "To do, checkbox, not checked" before its text.
 */
export function TaskCheckbox(props: ComponentProps<'input'>): ReactNode {
  if (props.type !== 'checkbox') {
    return <input {...props} />;
  }
  const label = props.checked
    ? translate({id: 'theme.blog.post.taskDone', message: 'Done'})
    : translate({id: 'theme.blog.post.taskTodo', message: 'To do'});
  return <input readOnly aria-label={label} {...props} />;
}
