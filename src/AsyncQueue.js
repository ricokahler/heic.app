// https://stackoverflow.com/a/47157577/5776910
class AsyncQueue {
  constructor() {
    // invariant: at least one of the arrays is empty
    this.resolvers = [];
    this.promises = [];
  }
  _add() {
    this.promises.push(
      new Promise(resolve => {
        this.resolvers.push(resolve);
      }),
    );
  }
  enqueue(t) {
    // if (this.resolvers.length) this.resolvers.shift()(t);
    // else this.promises.push(Promise.resolve(t));
    if (!this.resolvers.length) this._add();
    this.resolvers.shift()(t);
  }
  dequeue() {
    if (!this.promises.length) this._add();
    return this.promises.shift();
  }
  // now some utilities:
  isEmpty() {
    // there are no values available
    return !this.promises.length; // this.length <= 0
  }
  isBlocked() {
    // it's waiting for values
    return !!this.resolvers.length; // this.length < 0
  }
  get length() {
    return this.promises.length - this.resolvers.length;
  }
  [Symbol.asyncIterator]() {
    return {
      next: () => this.dequeue().then(value => ({ done: false, value })),
    };
  }
}

export default AsyncQueue;
