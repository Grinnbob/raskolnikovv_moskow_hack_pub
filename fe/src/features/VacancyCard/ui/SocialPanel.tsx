'use client';

import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { forwardIcon, heartIcon, messageIcon } from '../lib/icons';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { FC, useState } from 'react';

export type SocialPanelProps = {
  vacancyId: number;
  isLiked: boolean;
  isCommented: boolean;
  isShared: boolean;
  likesCount?: number | string;
  commentsCount?: number | string;
  sharesCount?: number | string;
};

export const SocialPanel: FC<SocialPanelProps> = ({
  vacancyId,
  isLiked,
  isShared,
  isCommented,
  likesCount,
  commentsCount,
  sharesCount,
}) => {
  const [state, setState] = useState({
    isLiked,
    isShared,
    isCommented,
    likesCount: Number(likesCount),
    commentsCount: Number(commentsCount),
    sharesCount: Number(sharesCount),
  });
  const { api, pending } = useBackend({ trackState: true });

  const onToggleLike = () => {
    if (state.isLiked) {
      return api.unlikeVacancy(vacancyId).then(() => {
        setState((prev) => ({
          ...prev,
          isLiked: false,
          likesCount: Math.max(prev.likesCount - 1, 0),
        }));
      });
    }
    api.likeVacancy(vacancyId).then(() => {
      setState((prev) => ({
        ...prev,
        isLiked: true,
        likesCount: prev.likesCount + 1,
      }));
    });
  };

  return (
    <div className='flex gap-2'>
      <AppButton
        icon={heartIcon}
        size='md'
        className={state.isLiked ? 'text-textBlue' : 'text-textLight'}
        onClick={onToggleLike}
        pending={pending.unlikeVacancy || pending.likeVacancy}
      >
        {state.likesCount}
      </AppButton>
      <AppButton
        icon={messageIcon}
        size='md'
        className={state.isCommented ? 'text-textBlue' : 'text-textLight'}
      >
        {state.commentsCount}
      </AppButton>
      <AppButton
        icon={forwardIcon}
        size='md'
        className={state.isShared ? 'text-textBlue' : 'text-textLight'}
      >
        {state.sharesCount}
      </AppButton>
    </div>
  );
};
