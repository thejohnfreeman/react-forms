import { TextFieldViewModel } from './TextFieldViewModel'

export class PasswordFieldViewModel extends TextFieldViewModel {
  public constructor(public initValue: string | null) {
    super(initValue, 'password')
  }
}
