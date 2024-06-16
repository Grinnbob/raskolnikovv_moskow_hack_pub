import { SavedFilterCard } from '@web/features/Search';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { FilterModel } from '@web/shared/types/models/filter';
import { Heading } from '@web/shared/ui/Heading';
import { Loader } from '@web/shared/ui/Loader';
import { FC, useEffect, useState } from 'react';

export type SavedFiltersProps = {
  onChoose: (filter: FilterModel) => void;
  initialData?: FilterModel[];
  onClose?: () => void;
};

export const SavedFilters: FC<SavedFiltersProps> = ({
  onChoose,
  onClose,
  initialData,
}) => {
  const [localData, setLocalData] = useState<FilterModel[]>(initialData || []);
  const { api, status, pending } = useBackend({ trackState: true });

  useEffect(() => {
    if (status === 'authenticated') {
      api.getMyFilters().then(setLocalData);
    }
  }, [status]);

  if (!localData.length && pending.getMyFilters) {
    return <Loader className='text-center mt-4' />;
  }

  if (!localData.length) return null;

  return (
    <div className='mt-6 w-full'>
      <Heading level={4}>Сохранённые поиски</Heading>
      <div className='flex flex-wrap flex-col gap-2 mt-2'>
        {localData.map((data) => (
          <SavedFilterCard
            data={data}
            key={data.id}
            onClick={() => {
              onChoose(data);
              onClose?.();
            }}
            onDelete={() => {
              setLocalData(localData.filter((filter) => filter !== data));
              api.deleteMyFilter(data.id).catch(() => {
                setLocalData(localData);
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};
