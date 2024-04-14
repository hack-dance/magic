export function createLater<T>() {
  let laterResolve: (value: T | PromiseLike<T>) => void = () => {}
  let laterReject: (reason?: unknown) => void = () => {}

  const laterPromise: Promise<T> = new Promise<T>((resolve, reject) => {
    laterResolve = resolve
    laterReject = reject
  })

  return {
    reject: laterReject,
    resolve: laterResolve,
    promise: laterPromise
  }
}
