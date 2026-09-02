export function isLocalPageLink(href, target, download) {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') &&
    !href.includes('\\') && (!target || target === '_self') && download === undefined;
}
