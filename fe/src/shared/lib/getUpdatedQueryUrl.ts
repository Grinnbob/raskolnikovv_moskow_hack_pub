export type Values = string | number | Array<string | number>;

const validateValue = (str?: Values) => {
  switch (str) {
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    default:
      return str;
  }
};

export const getUpdatedQueryUrl = (name: string, values?: Values) => {
  const currentUrl = new URL(window.location.href);
  const value = validateValue(values);

  if (value) {
    if (Array.isArray(value)) {
      currentUrl.searchParams.delete(name);
      value.forEach((value) =>
        currentUrl.searchParams.append(name, value.toString()),
      );
    } else {
      currentUrl.searchParams.set(name, value.toString());
    }
  } else {
    currentUrl.searchParams.delete(name);
  }

  return currentUrl.toString();
};

export const getReplacedQueryUrl = (query: Record<string, Values>) => {
  const currentUrl = new URL(
    window.location.origin + '/' + window.location.pathname,
  );

  Object.keys(query).forEach((queryName) => {
    const value = validateValue(query[queryName]);
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((value) =>
          currentUrl.searchParams.append(queryName, value.toString()),
        );
      } else {
        currentUrl.searchParams.set(queryName, value.toString());
      }
    }
  });

  return currentUrl.toString();
};
