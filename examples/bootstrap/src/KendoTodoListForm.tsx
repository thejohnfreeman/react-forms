import { Button } from '@progress/kendo-react-buttons'
import * as React from 'react'

import { GroupViewModel, ViewModels } from '@thejohnfreeman/react-forms'
import { Checkbox, Form, Input } from '@thejohnfreeman/react-forms-kendo'
import { observer } from '@thejohnfreeman/observer'

const TodoListItemViewModel = ViewModels.group({
  text: ViewModels.text(),
  done: ViewModels.boolean(),
})

type TodoListItemFormProps = {
  viewModel: GroupViewModel<any>
}

class TodoListItemForm extends React.Component<TodoListItemFormProps> {
  public render() {
    return (
      <Form viewModel={this.props.viewModel}>
        <div className="form-group">
          <Input name="text" />
        </div>
        <div className="form-group">
          <Checkbox name="done" />
        </div>
      </Form>
    )
  }
}

const TodoListViewModel = ViewModels.group({
  todos: ViewModels.array(TodoListItemViewModel),
})

export type TodoListFormProps = {}

class _TodoListForm extends React.Component<TodoListFormProps> {
  private readonly viewModel = TodoListViewModel.construct()

  private readonly addTodo = () => {
    this.viewModel.members.todos.items.push(TodoListItemViewModel.construct())
  }

  private readonly onSubmit = async values => {
    console.log('todos:', { ...values })
  }

  public render() {
    return (
      <>
        <h1 className="mt-3">todos</h1>
        <Button type="button" onClick={this.addTodo}>
          Add Todo
        </Button>
        <Form viewModel={this.viewModel} onSubmit={this.onSubmit}>
          {this.viewModel.members.todos.items.map((todo, index) => (
            <TodoListItemForm key={index} viewModel={todo} />
          ))}
          <Button type="submit">Submit</Button>
        </Form>
      </>
    )
  }
}

export const TodoListForm = observer(_TodoListForm)
