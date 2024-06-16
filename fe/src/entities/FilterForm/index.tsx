'use client';

import React, { FC, useCallback, useEffect, useRef } from 'react';
import { EAppInputType } from '@web/shared/types/enums/common';

type FilterFormProps = Omit<
  React.HTMLAttributes<HTMLFormElement>,
  'onChange'
> & {
  onChange: (name: string, currentValues: string | string[]) => void;
  name?: string;
};

export const FilterForm: FC<FilterFormProps> = ({
  children,
  onChange,
  name,
  ...formProps
}) => {
  const refCb = useRef(onChange);

  refCb.current = onChange;

  // useEffect(() => {
  //   const form = document.forms[name];
  //   form &&
  //     values &&
  //     Object.keys(values).forEach((inputName) => {
  //       const input = form[inputName];
  //       if (!input) return;
  //       if (input instanceof NodeList) {
  //         input.forEach((node) => {
  //           // @ts-ignore
  //           const appType = node.dataset.appType as EAppInputType | undefined;

  //           if (appType === EAppInputType.MULTI_CHECKBOX) {
  //           }
  //         });
  //       }
  //     });
  // }, [name, values]);

  const _onChange = useCallback((ev: React.FormEvent<HTMLFormElement>) => {
    const input = ev.target as HTMLInputElement;
    const appType = input.dataset.appType as EAppInputType | undefined;
    const form = ev.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    if (appType === EAppInputType.MULTI_CHECKBOX) {
      refCb.current(input.name, values.getAll(input.name) as string[]);
    } else {
      refCb.current(input.name, values.get(input.name) as string);
    }
  }, []);

  return (
    <form onChange={_onChange} {...formProps} name={name}>
      {children}
    </form>
  );
};
