import { getPageUrl } from './lib/utils';

export type FakePaginationProps = {
  page: number;
  query?: string;
  hasMore?: boolean;
  pathname?: string | null;
};

export const FakePagination = ({
  page,
  query,
  hasMore,
}: FakePaginationProps) => {
  return (
    <div className='hidden'>
      {page > 0 && (
        <a rel='prev' href={getPageUrl(page, -1, query)}>
          Предыдущая
        </a>
      )}
      {hasMore && (
        <a rel='next' href={getPageUrl(page, 1, query)}>
          Следующая
        </a>
      )}
    </div>
  );
};
