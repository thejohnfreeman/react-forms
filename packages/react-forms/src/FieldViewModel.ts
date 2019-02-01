import { computed, observable } from 'mobx'
import * as React from 'react'

import { Binder, ShouldBe } from './Binder'
import { ViewModel } from './ViewModel.interface'

// TODO: Add type parameter for `repr`.
export class FieldViewModel<V, R = V> implements ViewModel<V | null, R | null> {
  public constructor(
    private readonly binder: Binder<V | null, R | null>,
    public initValue: V | null,
  ) {}

  @observable
  public errors: React.ReactNode[] = []

  // Even if a null (i.e. missing) value is not valid, we must be able to
  // represent it.
  @observable
  private _value: V | null = this.initValue

  @observable
  private _repr: R | null = this.binder.render(this.initValue)

  @observable
  public touched: boolean = false

  @computed
  public get untouched(): boolean {
    return !this.touched
  }

  public set untouched(untouched: boolean) {
    this.touched = !untouched
  }

  public get type(): string {
    return this.binder.type
  }

  @computed
  public get value(): V | null {
    return this._value
  }

  public get $(): V | null {
    return this.value
  }

  public set value(value: V | null) {
    this._value = value
    this._repr = this.binder.render(value)
  }

  @computed
  public get repr(): R | null {
    return this._repr
  }

  public set repr(repr: R | null) {
    this.touched = true
    this._repr = repr
    const result: ShouldBe<V | null> = this.binder.parse(repr)
    if ('errors' in result) {
      this.errors = result.errors
      return
    }
    this._value = result.value
    this.errors = this.binder.validate(this._value)
  }
}

// Every binder that wants to construct a `FieldViewModel` as a callable
// object can use this handler.
export function constructFieldViewModel<V, R = V>(
  this: Binder<V, R>,
  initValue: V,
) {
  return new FieldViewModel(this, initValue)
}
