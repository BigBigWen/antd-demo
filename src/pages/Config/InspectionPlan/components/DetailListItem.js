import React from 'react';

const Item = ({ label, content }) => (
  <div className="ticket-item">
    <span className="item-label">{label}:</span>
    <span className="item-content">{content}</span>
  </div>
);

export default Item;
