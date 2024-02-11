import React from 'react';

const Reader = ({ content }) => (
  <div className="reader">
    <div className="definition">
      <span className="content">{content}</span>
    </div>
  </div>
);

const Box = ({ dreamId, dreamName, date, dreamType, clarity }) => (
  <button id={dreamId} className="box">
    <span className="left_top">Dream name: {dreamName}<br/> </span>
    <span className="right_top">Date: {date}</span>
    <span className="left_bottom">Type of dream: {dreamType}</span>
    <span className="right_bottom">Clarity: {clarity}</span>
  </button>
);

export default Reader;
export { Box };
