import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { GoCheck } from 'react-icons/go';
import styles from './styles.module.scss';
import { twMerge } from 'tailwind-merge';
import { Divider } from '@web/shared/ui/Divider';
import { Text } from '@web/shared/ui/Text';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';
import { useDidUpdateEffect } from '@web/shared/lib/hooks/useDidUpdateEffect';

export const shevron = (
  <MdKeyboardArrowDown size={23} className={styles.shevron} />
);

export type Option =
  | { id: string | number; value?: any | never }
  | { value: string | null; id?: any | never };

export type RenderFn<T> = (item: T, isOpened: boolean) => JSX.Element;

interface ListboxRenderPropArg<T> {
  open: boolean;
  disabled: boolean;
  value: T;
}

export type PseudoSelectProps<T, B extends boolean = false> = {
  data: T[];
  placeholder?: string;
  renderOption: RenderFn<T>;
  renderPreview?: B extends true ? RenderFn<T[]> : RenderFn<T>;
  onChange?: B extends true ? (items: T[]) => void : (item: T) => void;
  onSelect?: (item: T) => void;
  className?: string;
  label?: string;
  multiple?: B;
  renderFooter?: (
    selected: (B extends true ? T[] : T) | undefined,
    setSelected: Dispatch<
      SetStateAction<(B extends true ? T[] : T) | undefined>
    >,
    props: ListboxRenderPropArg<B extends true ? T[] : T>,
  ) => JSX.Element;
  error?: string;
  defaultSelected?: B extends true ? T[] : T;
  disabled?: boolean;
};

const defaultRenderPreview = (items: Array<any>) => (
  <Text size='s'>Выбрано {items.length}</Text>
);

const errorStyle = { borderColor: 'rgba(217, 69, 57, 1)' };

export const BasePseudoSelect = <T extends Option, B extends boolean>({
  data,
  renderOption,
  placeholder = 'Выберите из списка',
  className,
  label,
  onChange,
  multiple,
  renderPreview,
  renderFooter,
  error,
  defaultSelected,
  disabled,
  onSelect,
}: PseudoSelectProps<T, B>) => {
  const [selected, setSelected] = useState<T | T[]>(
    defaultSelected ? (defaultSelected as any) : undefined,
  );

  useDeepCompareEffectNoCheck(() => {
    setSelected(defaultSelected as any);
  }, [defaultSelected]);

  useDidUpdateEffect(() => {
    //@ts-ignore
    selected && onChange?.(selected);
  }, [selected]);

  const hasSelected = Boolean(multiple ? (selected as T[])?.length : selected);
  const isDisabled = disabled || !data?.length;

  return (
    <Listbox
      value={selected}
      onChange={setSelected}
      multiple={multiple}
      disabled={isDisabled}
    >
      {(listBoxProps) => {
        const { open } = listBoxProps;
        return (
          <>
            <div className={className}>
              {label && (
                <Listbox.Label className='block text-sm font-medium text-gray-900 mb-2'>
                  {label}
                </Listbox.Label>
              )}
              <div className='relative'>
                <Listbox.Button
                  className={twMerge(
                    'relative w-full cursor-default rounded-lg bg-appGray p-2.5 pr-10 text-left text-gray-900 shadow-sm focus:outline-none sm:text-sm border border-appGrayBorder',
                    open &&
                      'rounded-t-lg rounded-b-none border-appLightBlue border-x border-t border-b-0',
                    styles.buttonRing,
                    error && 'border-mainRed',
                    isDisabled && 'bg-appGray',
                  )}
                >
                  {hasSelected
                    ? multiple
                      ? (
                          (renderPreview as RenderFn<T[]>) ||
                          defaultRenderPreview
                        )(selected as T[], open)
                      : ((renderPreview as RenderFn<T>) || renderOption)(
                          selected as T,
                          open,
                        )
                    : placeholder && <span>{placeholder}</span>}
                  {!isDisabled && (
                    <span
                      className={twMerge(
                        'pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2',
                        open && styles.rotateChild,
                      )}
                    >
                      {shevron}
                    </span>
                  )}
                </Listbox.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options
                    className={twMerge(
                      error ? 'border-mainRed' : 'border-appLightBlue',
                      'absolute z-10 max-h-56 w-full overflow-auto rounded-b-lg bg-appGray text-base shadow-lg focus:outline-none sm:text-sm border-x border-b border-appLightBlue',
                    )}
                    style={error ? errorStyle : undefined}
                  >
                    <Divider className='mx-4 bg-strokeLight' />
                    {data.map((option) => (
                      <Listbox.Option
                        key={option.id || option.value}
                        className={({ active }) =>
                          twMerge(
                            active && 'bg-addBlue',
                            'relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 flex justify-between gap-2',
                          )
                        }
                        value={option}
                        onClick={onSelect && (() => onSelect(option))}
                      >
                        {({ selected }) => (
                          <>
                            {renderOption(option, open)}
                            {selected && (
                              <span
                                className={twMerge(
                                  'absolute inset-y-0 right-0 flex items-center pr-4 text-appLightBlue',
                                )}
                              >
                                <GoCheck
                                  className='h-5 w-5'
                                  aria-hidden='true'
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
              {error && <Text className='text-mainRed text-sm'>{error}</Text>}
            </div>
            {renderFooter?.(selected, setSelected, listBoxProps as any)}
          </>
        );
      }}
    </Listbox>
  );
};
