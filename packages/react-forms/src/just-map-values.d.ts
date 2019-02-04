declare module 'just-map-values' {
  function map<O extends object, B>(
    obj: O,
    f: (value: O[keyof O], key: keyof O, obj: O) => B,
  ): { [K in keyof O]: B }
  export default map
}
