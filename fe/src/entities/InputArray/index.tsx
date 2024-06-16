import { Text } from '@web/shared/ui/Text';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { useFieldArray, Control, UseFieldArrayReturn } from 'react-hook-form';
import { GoPlus } from 'react-icons/go';
import { RxCross1 } from 'react-icons/rx';

export type InputArrayProps = {
  renderInput: <T>(
    index: number,
    input: T & { id: string; value?: string },
    props: UseFieldArrayReturn<any, string, 'id'>,
  ) => JSX.Element;
  addButtonText?: string;
  label?: string;
  control: Control<any>;
  name: string;
  children?: (props: UseFieldArrayReturn<any, string, 'id'>) => JSX.Element;
  noAdd?: boolean;
  noRemove?: boolean;
  className?: string;
  maxLength?: number;
};

export const InputArray = ({
  renderInput,
  label,
  addButtonText = 'Добавить',
  control,
  name,
  children,
  noAdd,
  className,
  maxLength,
  noRemove,
}: InputArrayProps) => {
  const methods = useFieldArray({
    control,
    name,
    rules: { maxLength },
  });
  const formDisabled = control._formState.disabled;
  const hasCapacity = !maxLength || maxLength > methods.fields.length;
  return (
    <div className={className}>
      {label && (
        <Text size='s' className='font-medium mb-2 block'>
          {label}
        </Text>
      )}
      {methods.fields?.map((field, index) => {
        return (
          <div
            className='mb-2 flex justify-start gap-4 items-center'
            key={field.id}
          >
            {renderInput(index, field, methods)}
            {!noRemove && !formDisabled && (
              <RxCross1
                size={16}
                className='cursor-pointer text-textLight'
                onClick={() => methods.remove(index)}
              />
            )}
          </div>
        );
      })}
      {!noAdd && hasCapacity && !formDisabled && (
        <AppButton
          variant='outline'
          className='text-textBlue text-sm mt-2'
          icon={<GoPlus size={18} />}
          onClick={() => methods.append({ data: 1 })}
        >
          {addButtonText}
        </AppButton>
      )}
      {children?.(methods)}
    </div>
  );
};
