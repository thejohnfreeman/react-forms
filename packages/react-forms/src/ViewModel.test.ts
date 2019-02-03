import { ViewModels } from './ViewModels'

describe('FieldViewModel', () => {
  describe('text', () => {
    it('returns a constructor', () => {
      const Model = ViewModels.text()
      const model = Model.construct('abc')
      expect(model.value).toEqual('abc')
    })
    it('has validation method: optional', () => {
      const Model = ViewModels.text().optional()
      const model = Model.construct('abc')
      expect(model.value).toEqual('abc')
      expect(model.errors).toEqual([])
    })
    it('can start valid', () => {
      const Model = ViewModels.text()
      const model = Model.construct('abc')
      expect(model.valid).toEqual(true)
      expect(model.invalid).toEqual(false)
    })
    it('can start invalid', () => {
      const Model = ViewModels.text()
      const model = Model.construct()
      expect(model.valid).toEqual(false)
      expect(model.invalid).toEqual(true)
    })
  })
})

function sample1() {
  const Model = ViewModels.group({
    username: ViewModels.text(),
    password: ViewModels.password(),
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
