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

export default function Treemap({ root, width, height, labelGetter }) {
  root
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  treemap().size([width, height])(root);

  const paddingTop = 20;

  root.descendants().forEach((relativeRoot) => {
    relativeRoot.descendants().slice(1).forEach((desc) => {
      let referencePoint;
      let scale;

      // Vertical to bottom.
      scale = 1 - paddingTop / (relativeRoot.y1 - relativeRoot.y0);
      referencePoint = relativeRoot.y1;
      desc.y0 = referencePoint + scale * (desc.y0 - referencePoint);
      desc.y1 = referencePoint + scale * (desc.y1 - referencePoint);

      // Padding scale
      scale = 1 - 2 / (relativeRoot.x1 - relativeRoot.x0);

      // Vertical to top.
      referencePoint = relativeRoot.y0;
      desc.y0 = referencePoint + scale * (desc.y0 - referencePoint);
      desc.y1 = referencePoint + scale * (desc.y1 - referencePoint);

      // Horizontal to right.
      referencePoint = relativeRoot.x1;
      desc.x0 = referencePoint + scale * (desc.x0 - referencePoint);
      desc.x1 = referencePoint + scale * (desc.x1 - referencePoint);

      // Horizontal to left.
      referencePoint = relativeRoot.x0;
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
                      height: `${paddingTop}px`,
                      lineHeight: `${paddingTop - 2}px`,
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
  labelGetter: PropTypes.func,
};

Treemap.defaultProps = {
  labelGetter: node => node.data.key,
};
