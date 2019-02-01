// export interface ViewModel<V, R = V> {
export interface ViewModel<V, R = V> {
  // clean: boolean
  // clear: () => void
  // dirty: boolean
  // disabled: boolean
  // enabled: boolean
  // errors: string[]
  // reset: () => void
  // save: () => void
  touched: boolean
  untouched: boolean
  value: V
  // Short alias for `value`.
  $: V
  repr: R
}
