import React from 'react';
import { isNil } from 'lodash';
import './DetailListItem.less';

const Item = ({ label, content }) => (
  <div className="c-ticket-item">
    <span className="item-label">{label}:</span>
    <span className="item-content">
      {isNil(content) || content === '' ? '--' : content}
    </span>
  </div>
);

export default Item;
