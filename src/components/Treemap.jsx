/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line import/no-extraneous-dependencies
import { treemap } from 'd3-hierarchy';
import chroma from 'chroma-js';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import './Treemap.css';

function canDisplay(node) {
  const width = node.x1 - node.x0;
  const height = node.y1 - node.y0;
  if (width <= 1 || height <= 1) {
    return false;
  }

  return true;
}

function calculatePos(node) {
  return {
    transform: `translate(${node.x0}px, ${node.y0}px)`,
    width: `${node.x1 - node.x0}px`,
    height: `${node.y1 - node.y0}px`,
  };
}

export default function Treemap({ root, width, height, padding, labelGetter }) {
  root
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  treemap().size([width, height])(root);

  root.descendants().forEach((relativeRoot) => {
    relativeRoot.descendants().slice(1).forEach((desc) => {
      let referencePoint;
      let scale;

      // Scale vertically to bottom.
      scale = 1 - padding[0] / (relativeRoot.y1 - relativeRoot.y0);
      referencePoint = relativeRoot.y1;
      desc.y0 = referencePoint + scale * (desc.y0 - referencePoint);
      desc.y1 = referencePoint + scale * (desc.y1 - referencePoint);

      // Scale vertically to top.
      scale = 1 - padding[2] / (relativeRoot.y1 - relativeRoot.y0);
      referencePoint = relativeRoot.y0;
      desc.y0 = referencePoint + scale * (desc.y0 - referencePoint);
      desc.y1 = referencePoint + scale * (desc.y1 - referencePoint);

      // Scale horizontally to left.
      scale = 1 - padding[1] / (relativeRoot.x1 - relativeRoot.x0);
      referencePoint = relativeRoot.x0;
      desc.x0 = referencePoint + scale * (desc.x0 - referencePoint);
      desc.x1 = referencePoint + scale * (desc.x1 - referencePoint);

      // Scale horizontally to right.
      scale = 1 - padding[3] / (relativeRoot.x1 - relativeRoot.x0);
      referencePoint = relativeRoot.x1;
      desc.x0 = referencePoint + scale * (desc.x0 - referencePoint);
      desc.x1 = referencePoint + scale * (desc.x1 - referencePoint);
    });
  });

  const colorScale = scaleOrdinal(schemeCategory10);

  return (
    <div>
      <div style={{ width: `${width}px`, height: `${height}px`, margin: 'auto', overflow: 'hidden' }}>
        {root.descendants()
            .filter(item => canDisplay(item))
            .map((item, i) => (
              <div
                key={item.data.key + item.depth}
                className="treemap__node"
                style={{
              ...calculatePos(item, root),
              background: chroma(colorScale(i)).desaturate().brighten().hex(),
            }}
              >
                <div className="treemap__node-inner">
                  <div className="treemap__node-inner2">
                    <div style={{
                      height: `${padding[0]}px`,
                      lineHeight: `${padding[0] - 2}px`,
                      backgroundColor: item.children ? 'rgba(255,255,255,0.3)' : null,
                      fontSize: '12px',
                      paddingLeft: '4px',
                      color: chroma(colorScale(i)).darken(2).hex(),
                   }}
                    >
                      {labelGetter(item)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

Treemap.propTypes = {
  root: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.arrayOf(PropTypes.number),
  labelGetter: PropTypes.func,
};

Treemap.defaultProps = {
  labelGetter: node => node.data.key,
  padding: [20, 2, 2, 2],
};
