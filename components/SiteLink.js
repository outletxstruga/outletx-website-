import Link from 'next/link';
import { isLocalPageLink } from '../lib/navigation';

// Internal page changes keep the app and its loaded data alive.
// External destinations and new-tab/download links retain normal browser behavior.
export default function SiteLink({ href, target, download, children, ...props }) {
  if (isLocalPageLink(href, target, download)) {
    return <Link href={href} target={target} {...props}>{children}</Link>;
  }
  return <a href={href} target={target} download={download} {...props}>{children}</a>;
}
