import { Errors, ErrorsLike, PromiseLike } from './Errors'
import { ViewModel } from './ViewModel'

// A compound can be an object or an array.
export type CompoundOf<T, K extends keyof any = keyof any> = {
  [key in K]: T
}

type ViewModelCompound = CompoundOf<ViewModel<unknown, unknown>>

export type ErrorsCompound<
  C extends ViewModelCompound,
  E extends ErrorsLike = Errors
> = Partial<CompoundOf<E, keyof C>>

export type ErrorsCompoundLike<C extends ViewModelCompound> =
  | ErrorsCompound<C, ErrorsLike>
  | undefined

export type CompoundValidator<C extends ViewModelCompound> = (
  elements: C,
) => Promise<ErrorsCompound<C>>

export type CompoundValidatorLike<C extends ViewModelCompound> = (
  elements: C,
) => PromiseLike<ErrorsCompoundLike<C>>

export function CompoundValidator<C extends ViewModelCompound>(
  validatorLike: CompoundValidatorLike<C>,
): CompoundValidator<C> {
  return async (elements: C) => {
    const errors = await validatorLike(elements)
    if (!errors) {
      return {}
    }
    return errors
  }
}

export interface CompoundBinder<C extends ViewModelCompound> {
  readonly type: string
  readonly validators: CompoundValidatorLike<C>[]
}
