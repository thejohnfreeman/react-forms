import { computed, observable } from 'mobx'
import * as React from 'react'

import { ViewModel } from './ViewModel.interface'

type ShouldBe<V> = { value: V } | { errors: React.ReactNode[] }

// TODO: Add type parameter for `repr`.
export class FieldViewModel<V, R = V> implements ViewModel<V | null, R | null> {
  @observable
  public errors: React.ReactNode[] = []

  public constructor(public type: string, public initValue: V | null) {}

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

  // @ts-ignore
  protected _parse(repr: R | null): ShouldBe<V | null> {
    return { value: null }
  }

  // @ts-ignore
  protected _validate(value: V | null): React.ReactNode[] {
    return []
  }

  // @ts-ignore
  protected _render(value: V | null): R | null {
    return null
  }
}
