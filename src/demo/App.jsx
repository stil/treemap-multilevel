import React from 'react';
import { hierarchy } from 'd3-hierarchy';
import countries from './countries.json';
import nest from './nest/nest';
import Treemap from '../components/Treemap';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = nest()
      .key(d => d.region)
      .key(d => d.subregion)
      .entries(countries);

    const treeRoot = hierarchy({ key: 'World', values: data }, d => d.values);

    return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Treemap root={treeRoot} width={1200} height={610} />
      </div>
    );
  }
}
