import { CompoundBinder, CompoundValidatorLike } from './CompoundBinder'
import {
  GroupViewModel,
  GroupViewModelConstructor,
  ValueGroup,
  ViewModelConstructorGroup,
  ViewModelGroup,
} from './GroupViewModel'
import { map } from './Objects'

export class GroupBinder<G extends ViewModelGroup>
  implements CompoundBinder<G>, GroupViewModelConstructor<G> {
  public readonly type = 'group'

  public readonly validators: CompoundValidatorLike<G>[] = []

  public defaultValue: Partial<ValueGroup<G>> = {}

  public constructor(private readonly ctors: ViewModelConstructorGroup) {}

  public default(defaultValue: Partial<ValueGroup<G>>): this {
    this.defaultValue = defaultValue
    return this
  }

  public test(compoundValidatorLike: CompoundValidatorLike<G>): this {
    this.validators.push(compoundValidatorLike)
    return this
  }

  public construct(
    initValues: GroupViewModel<G> | Partial<ValueGroup<G>> = this.defaultValue,
  ): GroupViewModel<G> {
    if (initValues instanceof GroupViewModel) {
      return initValues
    }
    const members = map(this.ctors, (ctor, key) =>
      ctor.construct(initValues[key]),
    ) as G
    return new GroupViewModel(this, members)
  }
}
