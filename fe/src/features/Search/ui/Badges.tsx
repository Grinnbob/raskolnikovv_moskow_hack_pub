'use client';

import { FC, useMemo } from 'react';
import { Badge } from '@web/shared/ui/Badge';
import { RxCross1 } from 'react-icons/rx';
import { useUrlParamsApi } from '@web/shared/lib/hooks/useUrlParamsApi';

export type BadgesProps = {
  name: string;
  itemIds: string | string[];
  items: any[];
};

export const Badges: FC<BadgesProps> = ({ name, itemIds, items }) => {
  const paramsApi = useUrlParamsApi();

  const itemsHash = useMemo(() => {
    return items?.reduce<Record<string, any>>((acc, item) => {
      item.id && (acc[item.id] = item);
      return acc;
    }, {});
  }, [items]);

  const renderBadge = (model?: any) => {
    if (!model) return null;
    return (
      <Badge
        key={model.id}
        text={model?.title ?? model?.name}
        className='bg-white rounded-[48px]'
        iconEnd={
          <RxCross1
            size={12}
            onClick={() => {
              paramsApi.applyFilter?.(
                name,
                Array.isArray(itemIds)
                  ? itemIds.filter((itemId) => {
                      return itemId !== String(model.id);
                    })
                  : '',
              );
            }}
            className='cursor-pointer'
          />
        }
      />
    );
  };

  return (
    <div className='mt-2 flex flex-wrap gap-2'>
      {typeof itemIds === 'string'
        ? renderBadge(itemsHash[itemIds])
        : itemIds.map((itemId) => renderBadge(itemsHash[itemId]))}
    </div>
  );
};
