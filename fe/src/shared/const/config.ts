import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { RiAdvertisementLine } from 'react-icons/ri';
import { GrCompliance } from 'react-icons/gr';
import { FaRegEnvelope } from 'react-icons/fa';

export const BACKEND_URL = 'http://localhost:5001/api/';
export const BACKEND_STATIC = 'http://localhost:5001/';

export const DEFAULT_ERROR_TEXT =
  'Что-то пошло не по плану... Попробуйте позже.';

export const siteConfig = {
  title: 'Raskolnikovv',
  description: 'Description for Raskolnikovv',
  url: 'https://raskolnikovv.ru',
};

export const profileNavItems = [
  { name: 'Мой профиль', link: '/profile', icon: CgProfile },
  { name: 'Мои объявления', link: '/profile/my', icon: RiAdvertisementLine },
  {
    name: 'Избранное',
    link: '/profile/favorite',
    icon: MdOutlineFavoriteBorder,
  },
  {
    name: 'Мои операции',
    link: '/profile/my-operation',
    icon: GrCompliance,
  },
  {
    itemId: 'message',
    name: 'Сообщения',
    link: '/profile/chat',
    icon: FaRegEnvelope,
  },
] as const;

export const MAX_FILE_SIZE_BYTES = 25 * 1000000; // 25 Mb
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/gif',
];

export const DEFAULT_NAV_LINKS = [
  { name: 'Дашборд', isLink: true, href: '/dashboard' },
  { name: 'Поиск', isLink: true, href: '/search' },
  { name: 'Лента', isLink: true, href: '/news' },
  { name: 'Отклики', isLink: true, href: '/responces' },
  { name: 'Мои резюме', isLink: true, href: '/cvs' },
];
