// Based on https://medium.com/@fillopeter/pattern-matching-with-typescript-done-right-94049ddd671c

export type TypeMap<T extends string, U> = { [K in T]: U extends { type: K } ? U : never }

export type GenericPattern<T, U> = { [K in keyof T]: (message: T[K]) => U}

export interface AnnotatedType<T extends string> {
  type: T;
}

// not sure if any -> V was valid? but it compiles
export function genericMatcher<
  V extends string,
  W extends AnnotatedType<V>,
  U extends TypeMap<V, W>,
  T
>(pattern: GenericPattern<U, T>): (message: W) => T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (message: W): T => pattern[message.type](message as any)
}

// export function genericMatcher<V extends string, U extends TypeMap<any, AnnotatedType<V>>, T>
// (pattern: GenericPattern<U, T>): (message: AnnotatedType<V>) => T {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return (message: AnnotatedType<V>): T => pattern[message.type](message as any)
// }


export function isTypeGroup<V extends string, T extends AnnotatedType<V>>
  (prefix: string): (message: AnnotatedType<V>) => message is T {
  return (message): message is T => message.type.startsWith(prefix)
}

export function isType<V extends string, T extends AnnotatedType<V>>(label: V) {
  return (message: AnnotatedType<V>): message is T => {
    return message.type === label
  }
}

export function assertNever(_: never): never {
  throw new Error("Unexpected object");
}