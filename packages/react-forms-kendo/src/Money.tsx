import { NumericInput, NumericInputProps } from './NumericInput'
import { defaultProps } from './recompose'

export interface MoneyProps extends NumericInputProps {}
export const Money = defaultProps({ format: 'c2' })(NumericInput)
