describe('Proxy', () => {
  describe('with arrow function target', () => {
    it('can trap: apply', () => {
      const function_ = x => x + 1
      const proxy: typeof function_ = new Proxy(() => {}, {
        apply(_target, _context, args) {
          return function_.apply(null, args)
        },
      })
      expect(proxy(1)).toEqual(2)
    })
    it('can trap: apply, with context', () => {
      const object_ = { y: 1 }
      const function_ = function(x) {
        return x + this.y
      }
      const proxy: typeof function_ = new Proxy(() => {}, {
        apply(_target, _context, args) {
          return function_.apply(object_, args)
        },
      })
      expect(proxy(1)).toEqual(2)
    })
    it.skip('can trap: ownKeys', () => {
      // TODO: Write about this difference between Node and Jest.
      const object_ = { y: 1 }
      const proxy = new Proxy(() => {}, {
        ownKeys(_target) {
          return Reflect.ownKeys(object_)
        },
      })
      Reflect.ownKeys(proxy)
      Object.keys(proxy)
      console.log(proxy)
    })
  })
})
