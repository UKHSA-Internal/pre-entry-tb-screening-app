export function getDescribedBy(
  id: string,
  hint?: string,
  heading?: string,
  label?: string,
): string | undefined {
  if (hint) {
    return `${id}-hint`;
  }
  if (heading && label) {
    return `${id}-label`;
  }
  return undefined;
}
