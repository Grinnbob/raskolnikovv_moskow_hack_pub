'use client';

import { PseudoSelect } from '@web/entities/PseudoSelect';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { hireStatusMap } from '@web/shared/const/languageMappers';
import { Text } from '@web/shared/ui/Text';
import { findByKey } from '@web/shared/lib/getDefaultSelection';
import { FC, useEffect, useState } from 'react';
import { HireStatus } from '@web/shared/types/enums/hire';
import { twMerge } from 'tailwind-merge';
import { reavalidateAction } from '@web/app/actions';

export type HireStatusSelectProps = {
  status?: HireStatus;
  hireId: number;
};

export const HireStatusSelect: FC<HireStatusSelectProps> = ({
  status,
  hireId,
}) => {
  const [localStatus, setLocalStatus] = useState(status);
  const { api, pending } = useBackend({ trackState: true });

  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  return (
    <div className='flex items-center gap-2'>
      <Text size='s'>Статус отклика:</Text>
      <PseudoSelect
        data={hireStatusMap}
        defaultSelected={findByKey(hireStatusMap, localStatus, {
          sourceKey: 'value',
        })}
        renderOption={(item) => (
          <Text
            size='s'
            className={twMerge(
              'text-white',
              item.value === HireStatus.REFUSAL && 'text-mainRed',
            )}
          >
            {item.label}
          </Text>
        )}
        onChange={(statusItem) => {
          return api.changeHireStatus(hireId, statusItem.value).then((hire) => {
            reavalidateAction([
              `hire/?status${hire.status}`,
              `hire/?status${status}`,
            ]);
            setLocalStatus(hire.status);
          });
        }}
        multiple={false}
        disabled={pending.changeHireStatus}
        classNameOption='bg-textBlue hover:bg-black'
        classNameOptionsWrapper='bg'
        classNameButton='bg-textBlue text-white py-1.5'
      />
    </div>
  );
};
