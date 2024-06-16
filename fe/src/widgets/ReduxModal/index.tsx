'use client';

import Portal from '@web/entities/Portal';
import {
  selectModal,
  setModalState,
} from '@web/providers/redux/slices/general-slice';
import { Loader } from '@web/shared/ui/Loader';
import { Suspense, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { modalContentMap } from './ui';

import styles from './styles.module.scss';
import { useClickOutside } from '@web/shared/lib/hooks/useClickOutside';
import { RxCross1 } from 'react-icons/rx';
import IconButton from '@web/shared/ui/buttons/IconButton';

export const ReduxModal = () => {
  const modal = useSelector(selectModal);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => dispatch(setModalState(null));
  useClickOutside(ref, close);

  const Component = modal && modalContentMap[modal.type];
  return (
    <Portal show={Boolean(Component)}>
      {Component && (
        <div className={`px-10 py-8 rounded-2xl ${styles.modal}`} ref={ref}>
          {!(modal.props as any)?.noCloseIcon && (
            <div className='-mt-4 flex justify-end'>
              <IconButton
                icon={RxCross1}
                size={20}
                variant='ghost'
                className='text-textLight'
                onClick={close}
              />
            </div>
          )}
          <Suspense fallback={<Loader size='l' />}>
            <Component close={close} {...modal.props} />
          </Suspense>
        </div>
      )}
    </Portal>
  );
};
