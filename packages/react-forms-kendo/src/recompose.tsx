import * as React from 'react'

export type Subtract<Props extends object, DefaultProps extends object> = Pick<
  Props,
  Exclude<keyof Props, keyof DefaultProps>
>

// Spread props generally require a type assertion:
// https://github.com/Microsoft/TypeScript/issues/10727<Paste>
export const defaultProps = <DefaultProps extends object>(
  defaults: DefaultProps,
) => <Props extends object>(Component: React.ComponentType<Props>) =>
  React.forwardRef(
    (props: Subtract<Props, DefaultProps> & Partial<DefaultProps>, ref) => (
      <Component ref={ref} {...defaults} {...(props as Props)} />
    ),
  )
