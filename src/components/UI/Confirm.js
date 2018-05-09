import React from 'react';
import { Button } from 'antd';
import './Confirm.less';

const Confirm = ({ title, handleConfirm, handleCancel }) => {
  return (
    <div className="c-confirm">
      <h5>{title}</h5>
      <div className="c-confirm-btn-wrapper">
        <Button
          className="c-confirm-btn-cancel"
          size="small"
          onClick={handleCancel}
        >
          取消
        </Button>
        <Button size="small" type="primary" onClick={handleConfirm}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default Confirm;
