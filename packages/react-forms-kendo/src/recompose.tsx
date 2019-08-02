import * as React from 'react'
import { Subtract } from 'utility-types'

// Spread props generally require a type assertion:
// https://github.com/Microsoft/TypeScript/issues/10727<Paste>
export const defaultProps = <DefaultProps extends object>(
  defaults: DefaultProps,
) => <Props extends DefaultProps>(Component: React.ComponentType<Props>) => (
  props: Subtract<Props, DefaultProps> & Partial<DefaultProps>,
) => <Component {...defaults} {...props as Props} />
