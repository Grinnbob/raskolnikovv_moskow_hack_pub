'use client';

import { Heading } from '@web/shared/ui/Heading';
import { Autocomplete } from '@web/entities/Autocompete';
import { Badges } from './Badges';

export type CustomAutocompleteProps<T> = {
  name: string;
  header?: string;
  itemIds: string | string[];
  items: any[];
  renderCheckboxes: (open: boolean, models: T[], name: string) => JSX.Element;
};

const compare = (item: any, query: string) => {
  const itemName = item?.title ?? item?.name;
  // return itemName?.toLowerCase()?.includes(query?.toLowerCase());
  return itemName?.toLowerCase().includes(query.toLowerCase());
};

export const CustomAutocomplete = <T,>({
  name,
  header,
  items,
  itemIds,
  renderCheckboxes,
}: CustomAutocompleteProps<T>) => {
  return (
    <div>
      {header && <Heading level={4}>{header}</Heading>}
      <Autocomplete
        content={items}
        className='mt-2'
        onCompare={compare}
        renderContent={(open, models) => renderCheckboxes(open, models, name)}
      />
      {itemIds && <Badges name={name} items={items} itemIds={itemIds} />}
    </div>
  );
};
