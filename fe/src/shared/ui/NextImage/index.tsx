'use client';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

import { cn } from '@web/shared/lib/utils';

type NextImageProps = {
  useSkeleton?: boolean;
  classNames?: {
    image?: string;
    blur?: string;
  };
  alt: string;
} & (
  | { width: string | number; height: string | number }
  | { layout: 'fill'; width?: string | number; height?: string | number }
) &
  ImageProps;

const errorUmageUrl =
  'https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-1024.png';

export default function NextImage({
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  className,
  classNames,
  ...rest
}: NextImageProps) {
  const [status, setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete',
  );
  const widthIsSet = className?.includes('w-') ?? false;

  return (
    <figure
      style={!widthIsSet ? { width: `${width}px` } : undefined}
      className={className}
    >
      <Image
        className={cn(
          classNames?.image,
          status === 'loading' &&
            cn('animate-pulse', classNames?.blur, 'bg-[#f6f7f8]'),
        )}
        src={status === 'error' ? errorUmageUrl : src}
        width={width}
        height={height}
        alt={alt}
        onLoad={() => setStatus('complete')}
        onError={() => setStatus('error')}
        {...rest}
      />
    </figure>
  );
}
