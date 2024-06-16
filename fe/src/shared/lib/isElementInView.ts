export const isElementInView = (
  element: HTMLElement,
  containerRect: DOMRect,
) => {
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom
  );
};
