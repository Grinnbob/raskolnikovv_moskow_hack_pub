import { MainLayout } from '@web/layouts/MainLayout';
import styles from './styles.module.scss';

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout className={`bg-appGray ${styles.grayBody}`}>
      {children}
    </MainLayout>
  );
}
