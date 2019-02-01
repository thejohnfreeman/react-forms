import { computed, observable } from 'mobx'
import * as React from 'react'

import { ViewModel } from './ViewModel.interface'

export type ShouldBe<V> = { value: V } | { errors: React.ReactNode[] }

// TODO: Add type parameter for `repr`.
export abstract class FieldViewModel<V, R = V>
  implements ViewModel<V | null, R | null> {
  public constructor(public type: string, public initValue: V | null) {}

  @observable
  public errors: React.ReactNode[] = []

  // Even if a null (i.e. missing) value is not valid, we must be able to
  // represent it.
  @observable
  private _value: V | null = this.initValue

  @observable
  private _repr: R | null = this._render(this.initValue)

  @observable
  public touched: boolean = false

  @computed
  public get untouched(): boolean {
    return !this.touched
  }

  public set untouched(untouched: boolean) {
    this.touched = !untouched
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
    this._repr = this._render(value)
  }

  @computed
  public get repr(): R | null {
    return this._repr
  }

  public set repr(repr: R | null) {
    this.touched = true
    this._repr = repr
    const result: ShouldBe<V | null> = this._parse(repr)
    if ('errors' in result) {
      this.errors = result.errors
      return
    }
    this._value = result.value
    this.errors = this._validate(this._value)
  }

  // Takes the representation and returns either a value or an array of error
  // messages (as HTML or text).
  protected abstract _parse(repr: R | null): ShouldBe<V | null>

  // Takes the value and returns a possibly empty array of error messages (as
  // HTML or text).
  protected abstract _validate(value: V | null): React.ReactNode[]

  // Takes the value and returns the representation. Must not fail.
  protected abstract _render(value: V | null): R | null
}
