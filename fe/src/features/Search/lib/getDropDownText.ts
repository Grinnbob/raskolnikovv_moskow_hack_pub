export const getDropDownText = (
  checked?: Array<string>,
  defaultText = 'Выберите из списка',
) => {
  if (!checked) return defaultText;

  if (!Array.isArray(checked)) {
    return `Выбрано 1 значениe`;
  }

  return `Выбрано ${checked.length} значений`;
};
