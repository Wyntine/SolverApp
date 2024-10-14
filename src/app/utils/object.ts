export function copy<Obj>(object: Obj): Obj {
  return Object.assign({}, object);
}

export function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
