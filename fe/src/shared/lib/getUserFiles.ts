import toast from 'react-hot-toast';

type Options = {
  multiple?: boolean;
  accept?: string;
  validate?: (file: File) => string | void;
};

const defaultOptions = { multiple: false, accept: 'image/png, image/jpeg' };

export const getUserFiles = (
  onSelect: (files: Array<File>) => void,
  opt?: Options,
) => {
  const { multiple, accept, validate } = { ...defaultOptions, ...opt };
  const input = document.createElement('input');
  input.type = 'file';
  input.hidden = true;
  input.multiple = multiple;
  input.accept = accept;
  input.onchange = async (e) => {
    const files = (e.target as HTMLInputElement)?.files;
    const success: Array<File> = [];

    if (files?.length) {
      for (const file of files) {
        const msg = validate?.(file);
        if (!msg) success.push(file);
        else toast.error(msg);
      }
    }

    if (success?.length) {
      onSelect(success);
    }
  };
  input.click();
};
