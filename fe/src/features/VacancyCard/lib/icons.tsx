import { IoIosCheckmark } from 'react-icons/io';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { RiFireFill } from 'react-icons/ri';
import { CiHeart } from 'react-icons/ci';
import { RxChatBubble } from 'react-icons/rx';
import { TiArrowForwardOutline } from 'react-icons/ti';
import { FiEye } from 'react-icons/fi';
import { GoPeople } from 'react-icons/go';
import { BsFillLightningChargeFill } from 'react-icons/bs';

export const checkIcon = <IoIosCheckmark size='20px' />;
export const verifiedIcon = (
  <RiVerifiedBadgeFill size='20px' className='text-textBlue inline' />
);
export const flameIcon = (
  <RiFireFill size='20px' className='text-mainRed inline' />
);
export const heartIcon = <CiHeart size='20px' />;
export const messageIcon = <RxChatBubble size='20px' />;
export const forwardIcon = <TiArrowForwardOutline size='20px' />;

export const eyeIcon = <FiEye size='20px' className='text-strokeLight' />;
export const peopleIcon = <GoPeople size='20px' className='text-strokeLight' />;

export const lightningIcon = <BsFillLightningChargeFill size='24px' />;
