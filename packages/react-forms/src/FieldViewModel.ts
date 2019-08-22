import { action, computed, observable } from 'mobx'

import { Binder, ShouldBe } from './Binder'
import { Errors, ErrorsLike, PromiseLike, ValidatorLike } from './Errors'
import { ViewModel, ViewModelConstructor } from './ViewModel'

export type Version = Map<any, Errors> & { readonly __tag: unique symbol }

export class FieldViewModel<V, R = V> implements ViewModel<V, R> {
  public constructor(
    private readonly binder: Binder<V, R>,
    public initValue: V,
  ) {}

  @observable
  private _value: V = this.initValue

  @observable
  private _repr: R = this.binder.render(this.initValue)

  @observable
  private _errorsMap: Map<any, Errors> = new Map()

  @computed
  public get errors(): Errors {
    return ([] as Errors).concat(...this._errorsMap.values())
  }

  // Errors come in waves of 1 or more promises. Every wave goes into one
  // array. We track the last promise so that tests can wait for all changes
  // in flight.
  @computed
  public get version(): Version {
    return this._errorsMap as Version
  }

  public async setErrors(
    errorsLike: PromiseLike<ErrorsLike> = [],
    key: any = this,
    version: Version = this.version,
  ) {
    const errors = Errors(await errorsLike)
    if (errors.length === 0) {
      version.delete(key)
    } else {
      version.set(key, errors)
    }
  }

  public async addErrors(
    errorsLike: PromiseLike<ErrorsLike>,
    key: any = this,
    version: Version = this.version,
  ) {
    const errors = Errors(await errorsLike)
    if (errors.length === 0) {
      return
    }
    const value = version.get(key) || []
    value.push(...errors)
    version.set(key, value)
  }

  // A promise that completes after all _currently pending_ changes are
  // flushed to the view-model. Any subsequent changes need not be included.
  @observable
  public flushed: Promise<unknown> = this.validate()

  private async validate(): Promise<unknown> {
    const promises = this.binder.validators.map(
      (validatorLike: ValidatorLike<V>) =>
        this.setErrors(validatorLike(this._value), validatorLike),
    )
    const promise = Promise.all(promises)
    return promise
  }

  @observable
  public touched: boolean = false

  @observable
  public enabled: boolean = true

  @computed
  public get clean(): boolean {
    return this.binder.equals(this._value, this.initValue)
  }

  @computed
  public get dirty(): boolean {
    return !this.clean
  }

  @action
  public clear() {
    this.value = this.binder.defaultValue
  }

  @action
  public reset() {
    this.value = this.initValue
  }

  public save() {
    this.initValue = this.value
  }

  @computed
  public get disabled(): boolean {
    return !this.enabled
  }

  public set disabled(disabled: boolean) {
    this.enabled = !disabled
  }

  @computed
  public get invalid(): boolean {
    return !this.valid
  }

  @computed
  public get valid(): boolean {
    return this.errors.length < 1
  }

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
  public get value(): V {
    return this._value
  }

  public get $(): V {
    return this.value
  }

  public set value(value: V) {
    this._value = value
    this._errorsMap = new Map()
    this.flushed = this.validate()
    this._repr = this.binder.render(value)
  }

  @computed
  public get repr(): R {
    return this._repr
  }

  public set repr(repr: R) {
    this.touched = true
    this._repr = repr
    this._errorsMap = new Map()
    const parsed: ShouldBe<V> = this.binder.parse(repr)
    if ('errors' in parsed) {
      this.flushed = this.setErrors(parsed.errors)
    } else {
      this._value = parsed.value
      this.flushed = this.validate()
    }
  }
}

export type FieldViewModelConstructor<
  I,
  V extends I = I,
  R = V
> = ViewModelConstructor<I, V, R, FieldViewModel<V, R>>
