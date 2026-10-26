import type React from 'react';

declare global {
  /** React component with children */
  type FC<T = {}> = React.FunctionComponent<React.PropsWithChildren<T>>;
  /** React component without children */
  type RC<T = {}> = React.FunctionComponent<T>;
  /** Get props from an element type */
  type ComponentProps<T> = React.ComponentProps<T>;
  type ReactNode = React.ReactNode;
}
