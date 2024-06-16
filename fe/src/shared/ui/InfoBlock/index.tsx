import { twMerge } from 'tailwind-merge';

const classes = {
  bare: 'bg-white',
  info: 'bg-infoBg',
  error: 'bg-errorBg',
  blue: 'bg-addBlue',
  gray: 'bg-appGray',
};

type InfoBlock = React.PropsWithChildren<{
  variant?: keyof typeof classes;
  className?: string;
  badgeIcon?: JSX.Element;
}>;

export const InfoBlock: React.FC<InfoBlock> = ({
  variant = 'bare',
  children,
  className,
  badgeIcon,
}) => {
  return (
    <div
      className={twMerge(
        classes[variant],
        'p-5 rounded-xl text-black relative',
        className,
      )}
    >
      {badgeIcon && (
        <div className='absolute right-[-10px] -top-6 bg-white rounded-full p-2 flex justify-center items-center box-content'>
          {badgeIcon}
        </div>
      )}
      {children}
    </div>
  );
};
