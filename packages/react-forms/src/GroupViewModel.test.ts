import { ViewModel } from './ViewModel.namespace'

function sample1() {
  const makeGroup = ViewModel.group({
    username: ViewModel.text(),
    password: ViewModel.password(),
  })
  const initValue = {
    username: 'jfreeman',
    password: 'hunter2',
  }
  return { group: makeGroup(initValue), initValue }
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
