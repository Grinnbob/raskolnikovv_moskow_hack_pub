export const getPageUrl = (
  currentPage: number,
  modifier: 1 | -1 | 0 = 0,
  query?: string,
) => {
  const searchParams = new URLSearchParams(query);
  const page = currentPage + modifier;

  if (page > 0) {
    searchParams.set('page', String(currentPage + modifier));
  } else {
    searchParams.delete('page');
  }

  return '?' + searchParams.toString();
};
