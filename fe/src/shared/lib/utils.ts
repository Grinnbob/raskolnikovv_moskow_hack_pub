import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformDate(date: Date) {
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate: string = new Date(date).toLocaleDateString(
    'ru-RU',
    optionsDate,
  );
  const formattedTime: string = new Date(date).toLocaleTimeString(
    'ru-RU',
    optionsTime,
  );

  return `${formattedDate} / ${formattedTime}`;
}

// export async function getFilters(
//   id: string | string[],
// ): Promise<ICategory | null> {
//   const apiUrl = `http://localhost:8080/api/v1/category/${id}`;
//   try {
//     const response = await fetch(apiUrl, { cache: 'no-cache' });
//     const item: ICategory = await response.json();

//     return item;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return null;
//   }
// }

export function generateUrlImg(url: string) {
  return !url.includes('uploads')
    ? `https://${url}`
    : `http://localhost/${url}`;
}

// export const getImageLink = (folderName: string, imageName?: string | null) => {
//   if (!imageName || !process.env.REACT_APP_BACKEND_API_STATIC_URL) return;
//   return (
//     process.env.REACT_APP_BACKEND_API_STATIC_URL +
//     'images/' +
//     folderName +
//     '/' +
//     imageName
//   );
// };
