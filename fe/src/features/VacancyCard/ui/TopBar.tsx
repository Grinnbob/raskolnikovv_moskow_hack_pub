import { Text } from '@web/shared/ui/Text';
import { flameIcon } from '../lib/icons';
import { FC } from 'react';
import { VacancyModel } from '@web/shared/types/models/vacancy.model';

export type TopBarProps = {
  rating?: VacancyModel['rating'];
  skills?: VacancyModel['skills'];
};

export const TopBar: FC<TopBarProps> = ({ rating, skills }) => {
  const topBarSkills = rating?.overlap?.skills?.length
    ? rating.overlap.skills.slice(0, 3)
    : skills?.slice(0, 3)?.map((skill) => skill.title);

  if (!rating?.rating) {
    if (topBarSkills?.length) {
      return (
        <div className='h-[28px] absolute top-[-14px] z-10 bg-white py-[4px] px-[8px] flex items-center gap-4'>
          {topBarSkills?.map((skill: string) => (
            <Text size='s' color='secondary' key={skill}>
              {skill}
            </Text>
          ))}
        </div>
      );
    } else return null;
  }

  return (
    <div className='h-[28px] absolute top-[-14px] z-10 bg-white py-[4px] px-[8px] flex items-center gap-4'>
      {rating.rating > 70 && flameIcon}
      <Text size='s'>{rating.rating ? rating.rating + ' совпадения' : ''}</Text>
      {topBarSkills?.map((skill: string) => (
        <Text size='s' color='secondary' key={skill}>
          {skill}
        </Text>
      ))}
    </div>
  );
};
