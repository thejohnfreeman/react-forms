import { ViewModels } from './ViewModels'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('ViewModels', () => {
  describe('text', () => {
    it('has validation method: optional', async () => {
      const Model = ViewModels.text().optional()
      const model = Model.construct()
      await model.flushed
      expect(model.value).toBeNull()
      expect(model.errors).toEqual([])
    })
    it('can start valid', async () => {
      const Model = ViewModels.text()
      const model = Model.construct('abc')
      await model.flushed
      expect(model.value).toBe('abc')
      expect(model.repr).toBe('abc')
      expect(model.errors).toEqual([])
      expect(model.valid).toEqual(true)
      expect(model.invalid).toEqual(false)
    })
    it('can start invalid', async () => {
      const Model = ViewModels.text()
      const model = Model.construct()
      await model.flushed
      expect(model.value).toBeNull()
      expect(model.repr).toBe('')
      expect(model.errors).toEqual(['Please enter this field.'])
      expect(model.valid).toEqual(false)
      expect(model.invalid).toEqual(true)
    })
  })

  describe('integer', () => {
    it('diagnoses parse error', async () => {
      const Model = ViewModels.integerString()
      const model = Model.construct()
      model.repr = 'abc'
      await model.flushed
      expect(model.errors).toEqual(['Please enter an integer.'])
    })
  })
})

describe('FieldViewModel', () => {
  it('can add errors from promise-likes', async () => {
    const Model = ViewModels.number(0)
    const model = Model.construct()

    model.addErrors(Promise.resolve(['a']))
    await model.flushed
    expect(model.errors).toEqual(['a'])

    model.addErrors(Promise.resolve(['b']))
    model.addErrors(Promise.resolve(['c']))
    await model.flushed
    expect(model.errors).toEqual(['a', 'b', 'c'])

    model.addErrors(['d'])
    await model.flushed
    expect(model.errors).toEqual(['a', 'b', 'c', 'd'])
  })
  it('can reset errors', async () => {
    const Model = ViewModels.number(0)
    const model = Model.construct()

    model.setErrors(['a'])
    await model.flushed
    expect(model.errors).toEqual(['a'])

    model.setErrors()
    model.addErrors(['b'])
    await model.flushed
    expect(model.errors).toEqual(['b'])
  })
  it('discards late errors', async () => {
    const Model = ViewModels.number(0)
    const model = Model.construct()

    model.addErrors(sleep(150).then(() => ['a']))
    model.setErrors(['b'])
    await model.flushed
    expect(model.errors).toEqual(['b'])
  })
  describe('custom validator', () => {
    it('will be called', async () => {
      const Model = ViewModels.number().test(() => 'a')
      const model = Model.construct(0)
      await model.flushed
      expect(model.errors).toEqual(['a'])
    })
    it('can return multiple errors', async () => {
      const Model = ViewModels.number().test(() => ['a', 'b'])
      const model = Model.construct(0)
      await model.flushed
      expect(model.errors).toEqual(['a', 'b'])
    })
    it('can be async', async () => {
      const Model = ViewModels.number().test(async () => {
        await sleep(50)
        return 'a'
      })
      const model = Model.construct(0)
      await model.flushed
      expect(model.errors).toEqual(['a'])
    })
  })
})

describe('GroupViewModel', () => {
  describe('value', () => {
    it('returns object with values', () => {
      const Model = ViewModels.group({
        name: ViewModels.text(),
      })
      const initValue = { name: 'John' }
      const model = Model.construct(initValue)
      expect(model.value).toEqual(initValue)
    })
    it('proxies assignments', () => {
      const Model = ViewModels.group({
        name: ViewModels.text(),
      })
      const initValue = { name: 'John' }
      const model = Model.construct(initValue)
      model.value.name = 'James'
      expect(model.value).toEqual({ name: 'James' })
    })
  })

  describe('custom validator', () => {
    it('is called', () => {
      const Model = ViewModels.group({
        name: ViewModels.text(),
      }).test(() => ({ name: 'a' }))
      const model = Model.construct()
      // await model.flushed
      expect(model.members.name.errors).toEqual(['a'])
    })
  })
})
