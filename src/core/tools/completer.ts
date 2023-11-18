export default class Completer<T> {
  constructor() {
    this.promise = new Promise<T>((r) => {
      this.complete = r;
    });
  }

  promise: Promise<T>;

  complete: (value: T | PromiseLike<T> | null) => void;
}
