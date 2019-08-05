import { IdentityBinder } from './IdentityBinder'

export class IntegerBinder extends IdentityBinder<number> {
  public constructor(defaultValue: number | null = null) {
    super('integer', defaultValue)
  }
}
