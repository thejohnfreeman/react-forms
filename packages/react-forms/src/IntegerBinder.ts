import { AbstractBinder } from './AbstractBinder'

export class IntegerBinder extends AbstractBinder<number, number> {
  public constructor(defaultValue: number | null = null) {
    super('integer', defaultValue)
  }
}
