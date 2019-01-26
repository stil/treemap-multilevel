/* eslint-disable */
import map from './map';

export default function () {
  let keys = [],
    sortKeys = [],
    sortValues,
    rollup,
    nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    let i = -1,
      n = array.length,
      key = keys[depth++],
      keyValue,
      value,
      valuesByKey = map(),
      values,
      result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = `${key(value = array[i])}`)) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each((values, key) => {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    let array,
      sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();
    else array = [], map.each((v, k) => { array.push({ key: k, values: entries(v, depth) }); });
    return sortKey != null ? array.sort((a, b) => sortKey(a.key, b.key)) : array;
  }

  return nest = {
    object(array) { return apply(array, 0, createObject, setObject); },
    map(array) { return apply(array, 0, createMap, setMap); },
    entries(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key(d) { keys.push(d); return nest; },
    sortKeys(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues(order) { sortValues = order; return nest; },
    rollup(f) { rollup = f; return nest; },
  };
}

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map();
}

function setMap(map, key, value) {
  map.set(key, value);
}
