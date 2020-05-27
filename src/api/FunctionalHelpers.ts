export function partial<T, U, V>(func: (t: T, u: U) => V, t: T): (u: U) => V {
  return (u: U): V => func(t, u)
}

export function curry<T, U, V>(func: (t: T, u: U) => V): (t: T) => (u: U) => V {
  return (t: T) => (u: U): V => func(t, u)
}
