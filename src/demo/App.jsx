/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import chroma from 'chroma-js';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { treemapBinary, treemapResquarify } from 'd3-hierarchy';
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

const colorScale = scaleOrdinal(schemeCategory10);
const bgColorsMap = new Map();
const textColorsMap = new Map();
countryTree.descendants().forEach((node, i) => {
  bgColorsMap.set(node.data.key, chroma(colorScale(i)).desaturate().brighten().hex());
  textColorsMap.set(node.data.key, chroma(colorScale(i)).darken(2).hex());
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { zoomed: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(node) {
    this.setState((prevState) => {
      if (node.depth === 0) {
        return { zoomed: null };
      }
      return prevState.zoomed === node.data.key
        ? { zoomed: node.parent.data.key }
        : { zoomed: node.data.key };
    });
  }

  render() {
    const padding = [20, 2, 2, 2];
    const size = [800, 800];

    return (
      <div style={{ fontFamily: 'Roboto' }}>
        <style>
          {"@import url('https://fonts.googleapis.com/css?family=Roboto');"}
        </style>

        <div style={{ width: `${size[0]}px`, margin: 'auto' }}>
          <div style={{ margin: '12px 8px' }}>
            {this.state.zoomed === null
              ? 'No element zoomed'
              : countryTree
                .descendants()
                .find(node => node.data.key === this.state.zoomed)
                .ancestors()
                .reverse()
                .map((node, i) => (
                  <Fragment key={node.data.key}>
                    {i > 0 ? ' - ' : ''}<a href="#" onClick={(e) => { e.preventDefault(); this.handleClick(node); }}>{node.data.key}</a>
                  </Fragment>
                ))}
          </div>

          <div style={{ height: `${size[1]}px`, position: 'relative', overflow: 'hidden' /* borderRadius: '2px', backgroundClip: 'padding-box' */ }}>
            <Treemap
              tile={treemapBinary}
              root={countryTree}
              zoomed={this.state.zoomed}
              width={size[0]}
              height={size[1]}
              padding={padding}
              transition="all 300ms ease"
              nodeComponent={(node, i, posStyle) => (
                <div
                  className="treemap__node"
                  style={{
                    ...posStyle,
                    background: bgColorsMap.get(node.data.key),
                  }}
                >
                  <div
                    className={`treemap__label${node.children ? ' treemap__label--children' : ''}`}
                    onClick={() => { if (node.children) this.handleClick(node); }}
                    style={{
                          lineHeight: `${padding[0] - 2}px`,
                          color: textColorsMap.get(node.data.key),
                        }}
                  >
                    <div style={{ transition: 'all 300ms ease', transformOrigin: 'top left', transform: `scale(${((node.originalPos.x1 - node.originalPos.x0) / (node.x1 - node.x0))}, ${((node.originalPos.y1 - node.originalPos.y0) / (node.y1 - node.y0))})` }}>
                      {node.data.key} ({nFormatter(node.value)})
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
