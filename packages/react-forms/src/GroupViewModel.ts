import { computed, observable } from 'mobx'

import { Errors } from './Binder'
import { ObjectOf, Pluck, pluck } from './Objects'
import { ViewModel, ViewModelConstructor } from './ViewModel'

export type ViewModelGroup = ObjectOf<ViewModel<unknown, unknown>>

export type ValueGroup<G extends ViewModelGroup> = Pluck<G, 'value'>
export type ReprGroup<G extends ViewModelGroup> = Pluck<G, 'repr'>

// TODO: Rename to ObjectViewModel.
// We really want type aliases within class scopes.
// https://github.com/Microsoft/TypeScript/issues/7061
export class GroupViewModel<G extends ViewModelGroup>
  implements ViewModel<ValueGroup<G>, ReprGroup<G>> {
  private readonly proxy: ValueGroup<G>

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

  public get value(): ValueGroup<G> {
    return this.proxy
  }

  public get $(): ValueGroup<G> {
    return this.value
  }

  public set value(value: ValueGroup<G>) {
    Object.assign(this.proxy, value)
  }

  public get repr(): ReprGroup<G> {
    return pluck(this.members, 'repr')
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
function makeGroupProxy<G extends ViewModelGroup>(
  gvm: GroupViewModel<G>,
): ValueGroup<G> {
  const proxy = {} as ValueGroup<G>
  Object.keys(gvm.members).forEach(key => {
    Object.defineProperty(proxy, key, {
      enumerable: true,
      get: () => gvm.members[key].value,
      set: value => (gvm.members[key].value = value),
    })
  })
  return Object.freeze(proxy)
}

export type GroupViewModelConstructor<
  G extends ViewModelGroup
> = ViewModelConstructor<
  Partial<ValueGroup<G>>,
  ValueGroup<G>,
  ReprGroup<G>,
  GroupViewModel<G>
>

export type ViewModelConstructorGroup = ObjectOf<ViewModelConstructor<unknown>>

export type ViewModelGroupIsomorphicTo<G extends ViewModelConstructorGroup> = {
  [K in keyof G]: ReturnType<G[K]['construct']>
}

export type GroupViewModelConstructedBy<
  C
> = C extends GroupViewModelConstructor<infer G> ? GroupViewModel<G> : never
