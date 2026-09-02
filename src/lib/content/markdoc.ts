import Markdoc, { type Node } from '@markdoc/markdoc';

/**
 * Render a Keystatic Markdoc content node to an HTML string.
 * Presentation components only ever receive the finished HTML, never the AST —
 * that keeps `@markdoc/*` out of the component layer.
 */
export function renderRichText(node: Node): string {
  const transformed = Markdoc.transform(node);
  return Markdoc.renderers.html(transformed);
}

/** True when the node has any renderable child content. */
export function isRichTextEmpty(node: Node): boolean {
  return renderRichText(node).trim().length === 0;
}
