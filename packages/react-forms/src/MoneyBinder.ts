import { IdentityBinder } from './IdentityBinder'

export class MoneyBinder extends IdentityBinder<number> {
  public constructor(defaultValue: number | null = null) {
    super('money', defaultValue)
  }
}
