// Confusing name. This is a proxy handler that proxies an object and
// a function, effectively making a "callable object".
// https://github.com/Microsoft/TypeScript/issues/183
export class CallableObjectHandler<T extends object, A extends any[], R> {
  public constructor(
    public readonly object_: T,
    public readonly function_: (this: T, ...args: A) => R,
  ) {}

  public apply(_target, context, args: any[]) {
    if (context) {
      // Did someone bind this?
      console.error('unexpected context for callable object')
    }
    return this.function_.apply(this.object_, args)
  }

  public construct(_target, args: any[]) {
    return this.function_.apply(this.object_, args)
  }

  public defineProperty(_target, property, descriptor) {
    return Reflect.defineProperty(this.object_, property, descriptor)
  }

  public deleteProperty(_target, property) {
    return Reflect.deleteProperty(this.object_, property)
  }

  // What is "receiver"?
  public get(_target, property, receiver) {
    return Reflect.get(this.object_, property, receiver)
  }

  public getOwnPropertyDescriptor(_target, property) {
    return Reflect.getOwnPropertyDescriptor(this.object_, property)
  }

  public getPrototypeOf(_target) {
    return Reflect.getPrototypeOf(this.object_)
  }

  public has(_target, property) {
    return Reflect.has(this.object_, property)
  }

  public isExtensible(_target) {
    return Reflect.isExtensible(this.object_)
  }

  public ownKeys(_target) {
    return Reflect.ownKeys(this.object_)
  }

  public preventExtensions(_target) {
    return Reflect.preventExtensions(this.object_)
  }

  public set(_target, property, value, receiver) {
    return Reflect.set(this.object_, property, value, receiver)
  }

  public setPrototypeOf(_target, prototype) {
    return Reflect.setPrototypeOf(this.object_, prototype)
  }
}

// A proxy is not callable unless its target is callable.
// https://stackoverflow.com/a/32360219/618906
// To guarantee our target is callable, we use a dummy function, which means
// we have to override every proxy trap to redirect them to our real target
// object. We can use `Reflect` to help.

// If we use a dummy function declared as a function or function expression,
// then it will have non-configurable properties `prototype` and `arguments`
// that we must include in our own properties.
// https://stackoverflow.com/a/42876020/618906
// If we use an arrow function instead, it only has configurable properties
// `name` and `length`.

// const dummy = () => {}

export function callable(
  object_,
  function_,
): typeof object_ & typeof function_ {
  const handler = new CallableObjectHandler(object_, function_)
  return new Proxy(() => {}, handler)
}
