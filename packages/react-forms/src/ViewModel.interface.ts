// export interface ViewModel<V, R = V> {
export interface ViewModel<V, R = V> {
  readonly clean: boolean
  // clear: () => void
  readonly dirty: boolean
  disabled: boolean
  enabled: boolean
  errors: React.ReactNode[]
  readonly invalid: boolean
  // reset: () => void
  // save: () => void
  touched: boolean
  untouched: boolean
  readonly valid: boolean
  value: V
  // Short alias for `value`.
  $: V
  repr: R
}

export interface ViewModelConstructor<V, R = V> {
  construct(initValue: V): ViewModel<V, R>
}
