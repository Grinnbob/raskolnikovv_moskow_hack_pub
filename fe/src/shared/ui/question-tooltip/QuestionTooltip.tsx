import React, { FC, useState } from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';

type Props = {
  text: React.ReactNode;
};

export const FlipTooltip: FC<Props> = ({ text }) => {
  const [tooltip1Visible, setTooltip1Visible] = useState(false);

  const showTooltip = () => {
    setTooltip1Visible(true);
  };

  const hideTooltip = () => {
    setTooltip1Visible(false);
  };

  return (
    <div className='ml-2'>
      <div className='flex-col md:flex-row flex items-center md:justify-center'>
        <div
          role='link'
          aria-label='tooltip 1'
          className='focus:outline-none focus:ring-gray-300 rounded-full focus:ring-offset-2 focus:ring-2 focus:bg-gray-200 relative mt-20 md:mt-0'
          onMouseEnter={() => showTooltip()}
          onMouseLeave={() => hideTooltip()}
        >
          <FaRegQuestionCircle className='cursor-pointer font-bold hover:text-yellow-400' />
          {tooltip1Visible && (
            <div
              id='tooltip1'
              className='z-20 mt-1 w-64 absolute transition duration-150 ease-in-out   shadow-lg bg-black  p-3 rounded-xl text-white text-xs '
            >
              {text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
