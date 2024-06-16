'use client';
import React from 'react';
import { Combobox } from '@headlessui/react';

export type OptionsInputProps<T> = React.HTMLAttributes<HTMLInputElement> & {
  value: string;
  options: Array<T>;
  onSearch: (search: string) => void;
  onSelect: (value: T) => void;
  renderOption: (value: T) => React.ReactNode;
};

export const OptionsInput = <T,>({
  options,
  value,
  onSelect,
  onSearch,
  renderOption,
  ...rest
}: OptionsInputProps<T>) => {
  return (
    <Combobox value={value}>
      <Combobox.Input
        onChange={(event) => onSearch(event.target.value)}
        {...rest}
      />
      <Combobox.Options>
        {options.map((option, i) => {
          return (
            <Combobox.Option
              className='cursor-pointer p-1'
              key={String(i)}
              value={String(i)}
              onClick={
                onSelect &&
                (() => {
                  onSelect(option);
                })
              }
            >
              {renderOption(option)}
            </Combobox.Option>
          );
        })}
      </Combobox.Options>
    </Combobox>
  );
};
