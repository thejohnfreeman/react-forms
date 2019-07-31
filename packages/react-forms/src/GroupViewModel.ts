import map from 'just-map-values'
import { computed, observable } from 'mobx'

import { Errors } from './Binder'
import { ViewModel } from './ViewModel'

export type ViewModelGroup = { [key: string]: ViewModel<any, any> }
export type Flatten<
  G extends ViewModelGroup,
  K extends keyof ViewModel<any, any>
> = { [J in keyof G]: G[J][K] }

// TODO: Rename to ObjectViewModel.
// We really want type aliases within class scopes.
// https://github.com/Microsoft/TypeScript/issues/7061
export class GroupViewModel<
  G extends ViewModelGroup,
  V extends Flatten<G, 'value'> = Flatten<G, 'value'>,
  R extends Flatten<G, 'repr'> = Flatten<G, 'repr'>
> implements ViewModel<V, R> {
  private readonly proxy: V

  public constructor(public readonly members: G) {
    this.proxy = makeGroupProxy(this)
  }

  @observable
  public errors: Errors = []

  @computed
  public get invalid(): boolean {
    return !this.valid
  }

  @computed
  public get valid(): boolean {
    return (
      this.errors.length < 1 &&
      Object.values(this.members).every(vm => vm.valid)
    )
  }

  public get value(): V {
    return this.proxy
  }

  public get $(): V {
    return this.value
  }

  public set value(value: V) {
    Object.assign(this.proxy, value)
  }

  public get repr(): R {
    return map(this.members, vm => vm.repr) as R
  }

  @computed
  public get touched(): boolean {
    return Object.values(this.members).some(vm => vm.touched)
  }

  public set touched(touched: boolean) {
    Object.values(this.members).forEach(vm => (vm.touched = touched))
  }

  @computed
  public get untouched(): boolean {
    return !this.touched
  }

  public set untouched(untouched: boolean) {
    this.touched = !untouched
  }

  @computed
  public get enabled(): boolean {
    return Object.values(this.members).every(vm => vm.enabled)
  }

  public set enabled(enabled: boolean) {
    Object.values(this.members).forEach(vm => (vm.enabled = enabled))
  }

  @computed
  public get disabled(): boolean {
    return !this.enabled
  }

  public set disabled(disabled: boolean) {
    this.enabled = !disabled
  }

  @computed
  public get clean(): boolean {
    return Object.values(this.members).every(vm => vm.clean)
  }

  @computed
  public get dirty(): boolean {
    return !this.clean
  }

  public clear() {
    Object.values(this.members).forEach(vm => vm.clear())
  }

  public reset() {
    Object.values(this.members).forEach(vm => vm.reset())
  }

  public save() {
    Object.values(this.members).forEach(vm => vm.save())
  }
}

// TODO: Use a real Proxy to make this easier.
function makeGroupProxy<
  G extends ViewModelGroup,
  V extends Flatten<G, 'value'> = Flatten<G, 'value'>,
  R extends Flatten<G, 'repr'> = Flatten<G, 'repr'>
>(gvm: GroupViewModel<G, V, R>): V {
  const proxy = {}
  Object.keys(gvm.members).forEach(key => {
    Object.defineProperty(proxy, key, {
      enumerable: true,
      get: () => gvm.members[key].value,
      set: value => (gvm.members[key].value = value),
    })
  })
  return Object.freeze(proxy) as V
}
