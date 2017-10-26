export function toArray (object) {
  if (Array.isArray(object)) {
    return object;
  }
  let arr = [];
  for (let j = 0; j < object.count(); j++) {
    arr.push(object.objectAtIndex(j));
  }
  return arr;
}
