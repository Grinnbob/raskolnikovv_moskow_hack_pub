export const getPageUrl = (
  currentPage: number,
  modifier: 1 | -1 | 0 = 0,
  pathname = window.location.pathname,
  query = window.location.search,
) => {
  const searchParams = new URLSearchParams(query);
  const page = currentPage + modifier;

  if (page > 0) {
    searchParams.set('page', String(currentPage + modifier));
  } else {
    searchParams.delete('page');
  }

  return pathname + '?' + searchParams.toString();
};
