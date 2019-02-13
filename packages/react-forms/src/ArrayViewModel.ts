import { computed, observable } from 'mobx'

import { ViewModel } from './ViewModel'

export type ViewModelArray<V, R> = ViewModel<V, R>[]

export class ArrayViewModel<V, R> implements ViewModel<V[], R[]> {
  public constructor(items: ViewModelArray<V, R>) {
    this.items = items
  }

  @observable
  public items: ViewModelArray<V, R>

  @observable
  public errors: React.ReactNode[] = []

  @computed
  public get invalid(): boolean {
    return !this.valid
  }

  @computed
  public get valid(): boolean {
    return this.errors.length < 1 && this.items.every(vm => vm.valid)
  }

  public get value(): V[] {
    return this.items.map(vm => vm.value)
  }

  public get $(): V[] {
    return this.value
  }

  public get repr(): R[] {
    return this.items.map(vm => vm.repr)
  }

  @computed
  public get touched(): boolean {
    return this.items.some(vm => vm.touched)
  }

  public set touched(touched: boolean) {
    this.items.forEach(vm => (vm.touched = touched))
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
    return this.items.every(vm => vm.enabled)
  }

  public set enabled(enabled: boolean) {
    this.items.forEach(vm => (vm.enabled = enabled))
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
    return this.items.every(vm => vm.clean)
  }

  @computed
  public get dirty(): boolean {
    return !this.clean
  }

  public clear() {
    this.items.forEach(vm => vm.clear())
  }

  public reset() {
    this.items.forEach(vm => vm.reset())
  }

  public save() {
    this.items.forEach(vm => vm.save())
  }
}
