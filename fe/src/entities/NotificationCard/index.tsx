import { NotificationSource } from '@web/shared/types/enums/common';
import { NotificationModel } from '@web/shared/types/models/notification.model';
import { Badge } from '@web/shared/ui/Badge';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type NotificationCardProps = {
  notification: NotificationModel;
  className?: string;
};

const iconsMap: Partial<Record<NotificationSource, JSX.Element>> = {
  [NotificationSource.RESUME]: <Badge text='new' />,
};

export const NotificationCard: FC<NotificationCardProps> = ({
  notification,
  className,
}) => {
  return (
    <div className={twMerge('p-2 flex items-center', className)}>
      {iconsMap.RESUME}
      <div>
        <Text size='s' as='div' className='mb-2'>
          {notification.title}
        </Text>
        <Text as='div' size='xs'>
          {notification.title}
        </Text>
      </div>
    </div>
  );
};
