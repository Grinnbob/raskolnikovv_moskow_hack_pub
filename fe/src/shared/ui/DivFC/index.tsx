import React, { forwardRef } from 'react';

export const DivFC = forwardRef<
  HTMLivElement,
  React.HTMLttributes<HTMLivElement>
>((props, ref) => <div {...props} ref={ref} />);
