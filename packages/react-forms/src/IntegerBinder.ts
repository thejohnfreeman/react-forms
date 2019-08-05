import { IdentityOptionalBinder } from './IdentityOptionalBinder'

export class IntegerBinder extends IdentityOptionalBinder<number> {
  public constructor(defaultValue: number | null = null) {
    super('integer', defaultValue)
  }
}
