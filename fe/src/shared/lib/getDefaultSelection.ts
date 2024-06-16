export type IntersectedOptions<
  S extends string | object,
  T extends string | object,
> = (T extends object ? { targetKey: keyof T } : {}) &
  (S extends object ? { sourceKey: keyof S } : {}) & {
    revert?: boolean;
  };

export const getIntersected = <
  S extends string | object | number,
  T extends string | object | number,
>(
  source: S[],
  target: T[] | undefined | null,
  options: IntersectedOptions<S, T>,
) => {
  if (target?.length) {
    const targetTypePrimitive =
      typeof target?.[0] === 'string' || typeof target?.[0] === 'number';
    const sourceTypePrimitive =
      typeof source?.[0] === 'string' || typeof source?.[0] === 'number';

    const dict = target.reduce<Record<string, boolean>>((acc, item) => {
      if (targetTypePrimitive) {
        acc[item as string] = true;
      } else {
        //@ts-ignore
        const val = item[options.targetKey];

        if (typeof val === 'string' || typeof val === 'number') {
          acc[val] = true;
        }
      }
      return acc;
    }, {});

    return source.filter((sourceItem) => {
      let condition = false;
      if (sourceTypePrimitive) {
        condition = Boolean(dict[sourceItem as string]);
      } else {
        //@ts-ignore
        condition = Boolean(dict[sourceItem[options.sourceKey]]);
      }
      return options.revert ? !condition : condition;
    });
  }
};

export const findByKey = <
  S extends string | object,
  T extends string | null | undefined | number,
  SK extends S extends object ? keyof S : undefined,
>(
  source: S[],
  target: T,
  options: {
    sourceKey: SK;
  },
) => {
  if (target) {
    const sourceTypePrimitive =
      typeof source?.[0] === 'string' || typeof source?.[0] === 'number';
    return source.find((sourceItem) => {
      if (sourceTypePrimitive) {
        return (sourceItem as string | number) === target;
      } else {
        //@ts-ignore
        return sourceItem[options.sourceKey] === target;
      }
    });
  }
};
