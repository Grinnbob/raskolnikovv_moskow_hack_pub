import { BACKEND_STATIC } from '../const/config';

export const getImageLink = (folderName: string, imageName?: string | null) => {
  if (!imageName) return '';
  return BACKEND_STATIC + 'images/' + folderName + '/' + imageName;
};
