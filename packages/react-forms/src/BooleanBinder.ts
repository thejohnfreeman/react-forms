import { AbstractBinder } from './AbstractBinder'

export class BooleanBinder extends AbstractBinder<boolean, boolean> {
  public constructor(defaultValue: boolean = false) {
    super('boolean', defaultValue)
  }
}
