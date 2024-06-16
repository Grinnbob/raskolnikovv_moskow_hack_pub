import { FC } from 'react';
import { Text } from '../../Text';

export type WithCountProps = {
  count: number;
  children: React.ReactNode;
};

export const WithCount: FC<WithCountProps> = ({ count, children }) => {
  return (
    <div className='flex justify-between'>
      {children}
      <Text size='xs' color='secondary'>
        {count}
      </Text>
    </div>
  );
};
