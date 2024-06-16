import { useEffect, useState } from 'react';
import { getUserFiles } from '../getUserFiles';

export const useImageSrc = (
  foreightSrc?: string,
  validate?: (file: File) => string | void,
) => {
  const [src, setSrc] = useState(foreightSrc);

  const replaceSrc = (url: string = '') => {
    setSrc((prev) => {
      if (prev?.startsWith('data')) {
        URL.revokeObjectURL(prev);
      }
      return url;
    });
  };

  useEffect(() => {
    replaceSrc(foreightSrc);
  }, [foreightSrc]);

  useEffect(() => {
    return replaceSrc;
  }, []);

  return {
    src,
    setSrc: replaceSrc,
    selectSrc: () => {
      getUserFiles(
        (filelist) => {
          if (filelist[0]) {
            replaceSrc(URL.createObjectURL(filelist[0]));
          }
        },
        { validate },
      );
    },
  };
};
