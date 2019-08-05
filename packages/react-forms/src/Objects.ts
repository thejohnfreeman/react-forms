export type ObjectOf<T> = {
  [key: string]: T
}

export function map<A, B>(
  input: ObjectOf<A>,
  f: (a: A, key: string) => B,
): ObjectOf<B> {
  const output = {} as ObjectOf<B>
  Object.keys(input).forEach(key => {
    output[key] = f(input[key], key)
  })
  return output
}

export function zipWith<A, B, C>(
  ayys: ObjectOf<A>,
  bees: ObjectOf<B>,
  f: (a: A, b: B) => C,
): ObjectOf<C> {
  const output = {} as ObjectOf<C>
  Object.keys(ayys).forEach(key => {
    output[key] = f(ayys[key], bees[key])
  })
  return output
}

// `F` is for "functor". We would like to generalize this type and function to
// functors like `Array`, but TypeScript is not yet capable it seems.
export type Pluck<F extends ObjectOf<object>, A extends keyof F[keyof F]> = {
  [K in keyof F]: F[K][A]
}

export function pluck<F extends ObjectOf<object>, A extends keyof F[keyof F]>(
  functor: F,
  attribute: A,
): Pluck<F, A> {
  const output = {} as Pluck<F, A>
  Object.keys(functor).forEach((key: keyof F) => {
    output[key] = functor[key][attribute]
  })
  return output
}
