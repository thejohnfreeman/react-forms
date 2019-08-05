import { IdentityOptionalBinder } from './IdentityOptionalBinder'

export class MoneyBinder extends IdentityOptionalBinder<number> {
  public constructor(defaultValue: number | null = null) {
    super('money', defaultValue)
  }
}
