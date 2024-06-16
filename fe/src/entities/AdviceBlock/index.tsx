import { Badge } from '@web/shared/ui/Badge';
import { Heading } from '@web/shared/ui/Heading';
import { InfoBlock } from '@web/shared/ui/InfoBlock';
import { Text } from '@web/shared/ui/Text';

export const AdviceBlock = () => {
  return (
    <InfoBlock variant='info'>
      <Badge text='Coвет' variant='inverse' className='rounded-[40px] mb-2' />
      <Heading level={4} className='mb-1'>
        Пишем сопроводительное
      </Heading>
      <Text size='s'>
        Каким должно быть сопроводительное письмо, чтобы получить приглашение на
        интервью
      </Text>
    </InfoBlock>
  );
};
