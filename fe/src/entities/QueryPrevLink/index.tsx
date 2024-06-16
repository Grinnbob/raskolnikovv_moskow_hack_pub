import Link from 'next/link';
import { prevLinksMap } from './lib/const';
import { AppRoute, appRoute } from '@web/shared/const/routes';
import { FC } from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { Text } from '@web/shared/ui/Text';

export type QueryPrevLinkProps = {
  route?: AppRoute;
};

export const QueryPrevLink: FC<QueryPrevLinkProps> = ({ route }) => {
  if (!route || !prevLinksMap[route] || !appRoute[route]) {
    return null;
  }
  const linkName = prevLinksMap[route];
  const linkHref = appRoute[route];

  return (
    <Link href={linkHref} className='text-textBlue flex items-center mb-4'>
      <MdArrowBackIos />
      <Text size='s' color='blue'>
        {linkName}
      </Text>
    </Link>
  );
};
