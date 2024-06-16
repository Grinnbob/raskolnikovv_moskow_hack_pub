'use client';

import { Dispatch, SetStateAction } from 'react';
import { Text } from '@web/shared/ui/Text';
import { Badge } from '@web/shared/ui/Badge';
import { RxCross1 } from 'react-icons/rx';
import {
  BasePseudoSelect,
  Option,
  PseudoSelectProps,
} from './BasePseudoSelect';


export type Titleable = Option &
  ({ title: string; label?: string } | { label: string; title?: string });

export type MultichoiceChipsProps<T> = Omit<
  PseudoSelectProps<T, true>,
  'renderOption' | 'renderFooter'
>;

const renderFooter = (
  items: Titleable[] | undefined,
  setSelected: Dispatch<SetStateAction<Titleable[] | undefined>>,
) => {
  return (
    <div className='w-1/2 mt-6'>
      {items?.map((model) => {
        return (
          <Badge
            key={model.id}
            text={model.title || model.label}
            className='bg-white rounded-[48px] border border-strokeLight mr-2 mb-2'
            iconEnd={
              <RxCross1
                size={12}
                className='cursor-pointer'
                onClick={() => {
                  setSelected((prev) => prev?.filter((data) => data !== model));
                }}
              />
            }
          />
        );
      })}
    </div>
  );
};

const renderOption = (item: Titleable) => (
  <Text size='s'>{item.title || item.label}</Text>
);

export const MultichoiceChips = <T extends Titleable>(
  props: MultichoiceChipsProps<T>,
) => {
  return (
    <div className='flex justify-start w-full gap-4'>
      {/* @ts-ignore */}
      <BasePseudoSelect
        {...props}
        renderOption={renderOption}
        className='w-1/2'
        renderFooter={renderFooter}
        multiple
      />
    </div>
  );
};
