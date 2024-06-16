import styles from '../styles.module.scss';

export const variants = {
  default: {
    inactive:
      'inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-primaryDark hover:border-primaryDark group text-primary',
    active:
      'text-primary border-b-2 border-primary hover:text-primary hover:border-primary',
  },
  dot: {
    inactive: `${styles.dotInactive} inline-flex items-center justify-center p-4 border-transparent rounded-t-lg group text-black`,
    active: `${styles.dotActive}`,
  },
};
