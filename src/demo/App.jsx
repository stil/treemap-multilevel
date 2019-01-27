/* eslint-disable no-console */
import React from 'react';
import chroma from 'chroma-js';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import Treemap from '../components/Treemap';
import countryTree from './data/country-tree';
import './Treemap.css';

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
    const colorScale = scaleOrdinal(schemeCategory10);
    const padding = [20, 2, 2, 2];
    const size = [800, 800];

    return (
      <div style={{ fontFamily: 'Roboto' }}>
        <style>
          {"@import url('https://fonts.googleapis.com/css?family=Roboto');"}
        </style>


        <div style={{ width: `${size[0]}px`, height: `${size[1]}px`, margin: 'auto', overflow: 'hidden' }}>
          <Treemap
            root={countryTree}
            width={size[0]}
            height={size[1]}
            padding={padding}
            nodeComponent={(node, i, posStyle) => (
              <div
                className="treemap__node"
                style={{
                  ...posStyle,
                  background: chroma(colorScale(i)).desaturate().brighten().hex(),
                }}
              >
                <div className="treemap__node-inner">
                  <div className="treemap__node-inner2">
                    <div style={{
                      height: `${padding[0]}px`,
                      lineHeight: `${padding[0] - 2}px`,
                      backgroundColor: node.children ? 'rgba(255,255,255,0.3)' : null,
                      fontSize: '12px',
                      paddingLeft: '4px',
                      color: chroma(colorScale(i)).darken(2).hex(),
                   }}
                    >
                      {node.data.key} ({nFormatter(node.value)})
                    </div>
                  </div>
                </div>
              </div>
          )}
          />
        </div>
      </div>
    );
  }
}
