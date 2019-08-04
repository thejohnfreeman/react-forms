import { AbstractBinder } from './AbstractBinder'

export class MoneyBinder extends AbstractBinder<number, number> {
  public constructor(defaultValue: number | null = null) {
    super('money', defaultValue)
  }
}
