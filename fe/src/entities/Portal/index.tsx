'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  children: React.ReactNode;
  show?: boolean;
  onClose?: () => void;
  selector?: string;
  renderChildrenOnHide?: boolean;
};

const Portal = ({
  children,
  show,
  selector = 'appOverlay',
  renderChildrenOnHide,
}: PortalProps) => {
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    ref.current = document.getElementById(selector);
  }, [selector]);

  if (!show && renderChildrenOnHide) {
    return children;
  }

  return show && ref.current ? createPortal(children, ref.current) : null;
};

export default Portal;
