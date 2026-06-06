class Queue {
  constructor() { this.items = []; }
  enqueue(item)  { this.items.push(item); }
  dequeue()      { return this.items.shift(); }
  peek()         { return this.items[0]; }
  get size()     { return this.items.length; }
  get isEmpty()  { return this.items.length === 0; }
}
