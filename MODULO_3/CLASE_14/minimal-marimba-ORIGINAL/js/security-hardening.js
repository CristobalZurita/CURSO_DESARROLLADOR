'use strict';

/**
 * Security hardening (non-destructive):
 * - Enforces rel="noopener noreferrer" on target="_blank" links.
 * - Blocks dangerous URL protocols in links (javascript:, vbscript:, data:text/html).
 * - Disables right click context menu as a basic deterrent.
 */
(function securityHardening() {
  const DANGEROUS_PROTOCOLS = ['javascript:', 'vbscript:', 'data:text/html'];
  const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

  function isDangerousHref(rawHref) {
    if (!rawHref) return false;
    const normalizedHref = rawHref.trim().toLowerCase();
    return DANGEROUS_PROTOCOLS.some(protocol => normalizedHref.startsWith(protocol));
  }

  function hardenTargetBlank(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const targetValue = (anchor.getAttribute('target') || '').toLowerCase();
    if (targetValue !== '_blank') return;

    const relTokens = new Set(
      (anchor.getAttribute('rel') || '')
        .split(/\s+/)
        .map(token => token.trim().toLowerCase())
        .filter(Boolean)
    );

    relTokens.add('noopener');
    relTokens.add('noreferrer');
    anchor.setAttribute('rel', Array.from(relTokens).join(' '));
  }

  function neutralizeDangerousHref(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const rawHref = anchor.getAttribute('href') || '';
    if (!isDangerousHref(rawHref)) return;

    anchor.setAttribute('href', '#');
    anchor.setAttribute('aria-disabled', 'true');
    anchor.dataset.blockedBySecurity = 'true';
  }

  function hardenAnchor(anchor) {
    hardenTargetBlank(anchor);
    neutralizeDangerousHref(anchor);
  }

  function hardenAnchorsInNode(node) {
    if (!(node instanceof Element)) return;
    if (node.matches('a')) hardenAnchor(node);
    node.querySelectorAll('a').forEach(hardenAnchor);
  }

  function hardenAllAnchors() {
    document.querySelectorAll('a').forEach(hardenAnchor);
  }

  document.addEventListener('DOMContentLoaded', hardenAllAnchors);

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a');
    if (!anchor) return;
    const rawHref = anchor.getAttribute('href') || '';
    if (!isDangerousHref(rawHref)) return;
    event.preventDefault();
    event.stopPropagation();
  });

  // Basic anti-copy deterrent: block context menu except on editable controls.
  document.addEventListener('contextmenu', event => {
    if (event.target.closest(EDITABLE_SELECTOR)) return;
    event.preventDefault();
  });

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(hardenAnchorsInNode);
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
