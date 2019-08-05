import { IdentityBinder } from './IdentityBinder'

// This is a two-state Boolean value. There is no "missing value"
// representation.
export class BooleanBinder extends IdentityBinder<boolean> {
  public constructor(defaultValue: boolean = false) {
    super('boolean', defaultValue)
  }
}
