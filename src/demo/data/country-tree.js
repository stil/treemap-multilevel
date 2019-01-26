import { hierarchy } from 'd3-hierarchy';
import countries from './countries.json';

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const groupByArray = (list, keyGetter) => [...groupBy(list, keyGetter).entries()]
  .map(([key, values]) => ({ key, values }));

const countriesFiltered = countries
  .filter(c => c.population > 0)
  .map(c => ({ ...c, key: c.name, value: c.population }));

const byRegionAndSubregion = groupByArray(countriesFiltered, c => c.region)
  .map(({ key, values }) => ({ key, values: groupByArray(values, v => v.subregion) }));


const treeRoot = hierarchy({ key: 'World', values: byRegionAndSubregion }, d => d.values);

export default treeRoot;
