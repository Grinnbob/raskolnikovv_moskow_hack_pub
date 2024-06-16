import { Popover as LibPopover } from '@headlessui/react';
import { CiCircleInfo } from 'react-icons/ci';
import IconButton from '@web/shared/ui/buttons/IconButton';
import { FC, useRef } from 'react';
import {
  useFloating,
  FloatingArrow,
  arrow,
  autoUpdate,
} from '@floating-ui/react';

export type InfoPopoverProps = {
  children: React.ReactNode;
};

export const InfoPopover: FC<InfoPopoverProps> = ({ children }) => {
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      arrow({
        element: arrowRef,
      }),
    ],
  });

  return (
    <LibPopover>
      <LibPopover.Button
        as={IconButton}
        ref={refs.setReference}
        icon={CiCircleInfo}
        variant='ghost'
        className='text-textBlue'
        size={24}
      />
      <LibPopover.Panel
        ref={refs.setFloating}
        className='bg-blackBg text-white mt-2 rounded-lg'
        style={floatingStyles}
      >
        <FloatingArrow ref={arrowRef} context={context} />
        {children}
      </LibPopover.Panel>
    </LibPopover>
  );
};
