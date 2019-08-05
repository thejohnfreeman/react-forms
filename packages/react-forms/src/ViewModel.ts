export interface ViewModel<V, R = V> {
  readonly clean: boolean
  clear: () => void
  readonly dirty: boolean
  disabled: boolean
  enabled: boolean
  errors: React.ReactNode[]
  readonly invalid: boolean
  reset: () => void
  save: () => void
  touched: boolean
  untouched: boolean
  readonly valid: boolean
  value: V
  // Short alias for `value`.
  $: V
  repr: R
}

// `I` is the type of the initial value. It can be looser than `V`, if the
// constructor knows how to convert it to `V`. The constructor should always
// accept a `V` directly, which means `I` must subsume `V`, which means `I`
// needs to be either a base type of `V` or a union type including `V`.
export interface ViewModelConstructor<
  I,
  V extends I = I,
  R = V,
  M extends ViewModel<V, R> = ViewModel<V, R>
> {
  construct(initValue?: M | I): M
}
