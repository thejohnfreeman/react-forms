import * as React from 'react'
import { GroupViewModel, ViewModelGroup } from '@thejohnfreeman/react-forms'

export interface FormType<G extends ViewModelGroup> {
  viewModel: GroupViewModel<G>
  fields: G
  onChange: (event: any) => void
}

// How do we say "a Form of any ViewModelGroup"?
export const FormContext = React.createContext<{
  form: FormType<any>
} | null>(null)
