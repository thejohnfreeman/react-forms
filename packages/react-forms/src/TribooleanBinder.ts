import { IdentityOptionalBinder } from './IdentityOptionalBinder'

export class TribooleanBinder extends IdentityOptionalBinder<boolean> {
  public constructor(defaultValue: boolean | null = null) {
    super('boolean', defaultValue)
  }
}
