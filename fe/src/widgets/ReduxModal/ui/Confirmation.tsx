import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';

export type ConfirmationProps = {
  question: string;
  description?: string;
};

const Confirmation: FC<ConfirmationProps> = ({ description, question }) => {
  return (
    <div>
      <Heading level={2} className='mb-2'>
        {question}
      </Heading>
      {description && <Text>{description}</Text>}
    </div>
  );
};

export default Confirmation;
