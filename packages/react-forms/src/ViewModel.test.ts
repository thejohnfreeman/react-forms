import { ViewModel } from './ViewModel.namespace'

describe('FieldViewModel', () => {
  describe('text', () => {
    it('returns a constructor', () => {
      const Model = ViewModel.text()
      const model = Model.construct('abc')
      expect(model.value).toEqual('abc')
    })
    it('has validation method: optional', () => {
      const Model = ViewModel.text().optional()
      const model = Model.construct('abc')
      expect(model.value).toEqual('abc')
      expect(model.errors).toEqual([])
    })
  })
})

function sample1() {
  const Model = ViewModel.group({
    username: ViewModel.text(),
    password: ViewModel.password(),
  })
  const initValue = {
    username: 'jfreeman',
    password: 'hunter2',
  }
  return { group: Model.construct(initValue), initValue }
}

describe('GroupViewModel', () => {
  describe('value', () => {
    it('returns object with values', () => {
      const { group, initValue } = sample1()
      expect(group.value).toEqual(initValue)
    })
    it('proxies assignments', () => {
      const { group, initValue } = sample1()
      const username = group.value.username + '2'
      group.value.username = username
      expect(group.value).toEqual({ ...initValue, username })
    })
  })
})
