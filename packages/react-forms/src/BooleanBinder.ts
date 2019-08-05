import { IdentityBinder } from './IdentityBinder'

export class BooleanBinder extends IdentityBinder<boolean> {
  public constructor(defaultValue: boolean = false) {
    super('boolean', defaultValue)
    this.optRequired = false
  }
}
