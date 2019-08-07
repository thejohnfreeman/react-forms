import { action, computed, observable } from 'mobx'

import { Binder, Errors, ShouldBe } from './Binder'
import { ViewModel, ViewModelConstructor } from './ViewModel'

type PromiseLike<T> = T | Promise<T>

export class FieldViewModel<V, R = V> implements ViewModel<V, R> {
  public constructor(
    private readonly binder: Binder<V, R>,
    public initValue: V,
  ) {}

  @observable
  private _value: V = this.initValue

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

  // Return a promise that completes after all _currently pending_ changes are
  // flushed to the view-model. Any subsequent changes need not be included.
  @computed
  public get flushed(): Promise<void> {
    return this._errorsPromise
  }

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
  public get value(): V {
    return this._value
  }

  public get $(): V {
    return this.value
  }

  public set value(value: V) {
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
    const parsed: ShouldBe<V> = this.binder.parse(repr)
    if ('errors' in parsed) {
      this.setErrors(parsed.errors)
      return
    }
    this._value = parsed.value
    this.setErrors(this.binder.validate(this._value))
  }
}

export type FieldViewModelConstructor<
  I,
  V extends I = I,
  R = V
> = ViewModelConstructor<I, V, R, FieldViewModel<V, R>>
