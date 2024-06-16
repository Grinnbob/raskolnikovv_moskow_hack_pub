import { Checkbox } from '@web/shared/ui/form/Checkbox';
import { useMemo } from 'react';

export const useRenderCheckbox = (
  filters: Record<string, string[] | string>,
) => {
  return useMemo(() => {
    const filtersMap = Object.keys(filters).reduce<
      Record<string, Record<string, boolean>>
    >((filterNames, filterName) => {
      if (Array.isArray(filters[filterName])) {
        filterNames[filterName] = (filters[filterName] as string[]).reduce<
          Record<string, boolean>
        >((acc, val) => {
          acc[val] = true;
          return acc;
        }, {});
      } else {
        filterNames[filterName] = {
          [filters[filterName] as string]: true,
        };
      }
      return filterNames;
    }, {});

    return <T,>(isOpen: boolean, models: T[], name: string) => {
      return (
        <div className='flex flex-col gap-2'>
          {models?.map((item: any) => {
            const value = item.value || item.id;
            return (
              <Checkbox
                key={item.id ?? item.value}
                label={item.title ?? item.name ?? item.label}
                value={String(item.id ?? item.value)}
                name={name}
                checked={filtersMap[name]?.[value]}
                group
              />
            );
          })}
        </div>
      );
    };
  }, [filters]);
};
