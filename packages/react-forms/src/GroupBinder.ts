import {
  GroupViewModel,
  GroupViewModelConstructor,
  ValueGroup,
  ViewModelConstructorGroup,
  ViewModelGroupIsomorphicTo,
} from './GroupViewModel'
import { map } from './Objects'

export class GroupBinder<G extends ViewModelConstructorGroup>
  implements GroupViewModelConstructor<ViewModelGroupIsomorphicTo<G>> {
  public readonly type = 'group'

  public defaultValue: Partial<ValueGroup<ViewModelGroupIsomorphicTo<G>>> = {}

  public constructor(private readonly ctors: G) {}

  public default(
    defaultValue: Partial<ValueGroup<ViewModelGroupIsomorphicTo<G>>>,
  ): this {
    this.defaultValue = defaultValue
    return this
  }

  public construct(
    initValues:
      | GroupViewModel<ViewModelGroupIsomorphicTo<G>>
      | Partial<ValueGroup<ViewModelGroupIsomorphicTo<G>>> = this.defaultValue,
  ): GroupViewModel<ViewModelGroupIsomorphicTo<G>> {
    if (initValues instanceof GroupViewModel) {
      return initValues
    }
    return new GroupViewModel(map(this.ctors, (ctor, key) =>
      ctor.construct(initValues[key]),
    ) as ViewModelGroupIsomorphicTo<G>)
  }
}
