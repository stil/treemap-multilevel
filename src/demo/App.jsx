/* eslint-disable no-console */
import React, { Fragment } from 'react';
import Treemap from '../components/Treemap';
import countryTree from './data/country-tree';

function nFormatter(num, digits) {
  const si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ fontFamily: 'Roboto' }}>
        <style>
          {"@import url('https://fonts.googleapis.com/css?family=Roboto');"}
        </style>
        <Treemap
          root={countryTree}
          width={800}
          height={800}
          labelGetter={n => <Fragment>{n.data.key} ({nFormatter(n.value)})</Fragment>}
        />
      </div>
    );
  }
}
