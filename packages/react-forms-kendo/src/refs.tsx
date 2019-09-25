import * as React from 'react'

import { Subtract } from './recompose'

export interface WithRefProps {
  // TODO: Can we find the right type argument?
  innerRef: React.Ref<any>
}

export const withRef = <Props extends WithRefProps>(
  Component: React.ComponentType<Props>,
) =>
  React.forwardRef((props: Subtract<Props, WithRefProps>, ref) => (
    <Component innerRef={ref} {...(props as Props)} />
  )) as any
