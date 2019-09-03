import * as React from 'react'

export interface WithRefProps {
  // TODO: Can we find the right type argument?
  innerRef: React.Ref<any>
}

export function withRef<Props extends object>(
  Component: React.ComponentType<Props & WithRefProps>,
): React.ComponentType<Props> {
  return React.forwardRef((props: Props, ref: React.Ref<any>) => (
    <Component innerRef={ref} {...props} />
  )) as any
}
