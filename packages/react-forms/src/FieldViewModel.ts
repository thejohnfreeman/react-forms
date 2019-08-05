import { action, computed, observable } from 'mobx'

import { Binder, Errors, ShouldBe } from './Binder'
import { ViewModel, ViewModelConstructor } from './ViewModel'

type PromiseLike<T> = T | Promise<T>

// TODO: Add type parameter for `repr`.
export class FieldViewModel<V, R = V> implements ViewModel<V | null, R> {
  public constructor(
    private readonly binder: Binder<V | null, R>,
    public initValue: V | null,
  ) {}

  // Even if a null (i.e. missing) value is not valid, we must be able to
  // represent it.
  @observable
  private _value: V | null =
    typeof this.initValue === 'undefined'
      ? this.binder.defaultValue
      : this.initValue

  private _makeErrorsPromise(promise: Promise<Errors>) {
    const errorsPromise = promise.then(errors => {
      // Only the last assigned promise wins.
      if (this._errorsPromise === errorsPromise) {
        this._errors = errors
      }
    })
    return errorsPromise
  }

  private _errorsPromise: Promise<void> = this._makeErrorsPromise(
    this.binder.validate(this.initValue),
  )

  @observable
  private _errors: Errors = []

  @computed
  public get errors(): Errors {
    return this._errors
  }

  private setErrors(promiseLike: PromiseLike<Errors>) {
    this._errorsPromise = this._makeErrorsPromise(Promise.resolve(promiseLike))
  }

  @observable
  private _repr: R = this.binder.render(this.initValue)

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
  public get value(): V | null {
    return this._value
  }

  public get $(): V | null {
    return this.value
  }

  public set value(value: V | null) {
    this._value = value
    this.setErrors(this.binder.validate(this._value))
    this._repr = this.binder.render(value)
  }

  @computed
  public get repr(): R {
    return this._repr
  }

  public set repr(repr: R) {
    this.touched = true
    this._repr = repr
    const parsed: ShouldBe<V | null> = this.binder.parse(repr)
    if ('errors' in parsed) {
      this.setErrors(parsed.errors)
      return
    }
    this._value = parsed.value
    this.setErrors(this.binder.validate(this._value))
  }
}

export interface FieldViewModelConstructor<I, V extends I, R>
  extends ViewModelConstructor<I | null, V | null, R, FieldViewModel<V, R>> {
  construct(initValue?: FieldViewModel<V, R> | I | null): FieldViewModel<V, R>
}
